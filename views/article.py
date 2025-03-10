from flask import render_template, request, Blueprint, current_app
from models.article import Article
from ast import literal_eval
from cachelib import SimpleCache

cache = SimpleCache()


# convert string to list
def convert_str(comments):
    if comments is None:
        return []
    try:
        return literal_eval(comments)
    except (ValueError, SyntaxError):
        return []


def build_next_article_map():
    """Build a mapping of each article to a 'next' article"""
    article_obj = Article()
    all_articles = article_obj.get_all()

    # Exit early if no articles
    if not all_articles or len(all_articles) <= 1:
        return {}

    import random

    # Get all article titles
    article_titles = [article[0] for article in all_articles]

    # Create a shuffled copy of the titles for "next" articles
    next_articles = article_titles.copy()
    random.shuffle(next_articles)

    # Make sure no article points to itself
    for i, title in enumerate(article_titles):
        if next_articles[i] == title:
            # Swap with another position if the shuffle mapped to itself
            for j in range(len(next_articles)):
                if j != i and next_articles[j] != article_titles[i]:
                    next_articles[i], next_articles[j] = (
                        next_articles[j],
                        next_articles[i],
                    )
                    break

    # Create the mapping
    next_article_map = {
        article_titles[i]: next_articles[i] for i in range(len(article_titles))
    }
    return next_article_map


bp = Blueprint("article", __name__)


@bp.route("/article/<title>")
def article(title):
    with current_app.app_context():
        # Cache individual articles
        cache_key = f"article_{title}"
        article_data = cache.get(cache_key)

        if not article_data:
            article_data = Article().get(title)
            if article_data:
                # Cache indefinitely if article exists
                cache.set(cache_key, article_data, timeout=0)
            else:
                return "Article not found", 404

        # Get the next article map from cache or build it
        next_article_map = cache.get("next_article_map")
        if not next_article_map:
            next_article_map = build_next_article_map()
            # Cache the mapping for 1 hour (3600 seconds)
            cache.set("next_article_map", next_article_map, timeout=3600)

        # Get the next article for this title
        next_article_title = next_article_map.get(title)

        comments = convert_str(article_data[2])
        return render_template(
            "article.html",
            title=article_data[0],
            content=article_data[1],
            comments=comments,
            next_article=next_article_title,
        )
