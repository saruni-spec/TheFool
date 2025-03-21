from flask import render_template, request, Blueprint, current_app
from models.article import Article
from ast import literal_eval
from cachelib import SimpleCache

# Create a module-level cache instance
cache = SimpleCache()


def build_next_article_map():
    """Build a mapping of each article to a 'next' article"""
    article_obj = Article()
    all_articles = article_obj.get_all()
    # Exit early if no articles
    if not all_articles or len(all_articles) <= 1:
        return {}

    import random

    # Get all article titles
    article_titles = [
        article[1] for article in all_articles
    ]  # Using index 1 for article_name

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
    # Cache individual articles
    cache_key = f"article_{title}"
    article_data = cache.get(cache_key)

    if not article_data:
        article_data = Article().get(title)
        if not article_data:
            return "Article not found", 404

        # Cache indefinitely if article exists
        cache.set(cache_key, article_data, timeout=0)

    # Get the next article map from cache or build it
    next_article_map = cache.get("next_article_map")
    if not next_article_map:
        next_article_map = build_next_article_map()
        # Cache the mapping for 1 hour (3600 seconds)
        cache.set("next_article_map", next_article_map, timeout=3600)

    # Get the next article for this title
    next_article_title = next_article_map.get(title)

    # Process comments from the new structure
    comments = []
    if (
        article_data[4] and article_data[4][0] is not None
    ):  # Check if comments exist and first is not null
        for comment_data in article_data[4]:
            if isinstance(comment_data, dict):
                comments.append(
                    {
                        "author": comment_data.get(
                            "name", comment_data.get("author")
                        ),  # Use name if available, fallback to author (user_id)
                        "content": comment_data.get("content"),
                    }
                )

    return render_template(
        "article.html",
        title=article_data[1],  # article_name
        content=article_data[2],  # article_content
        comments=comments,
        next_article=next_article_title,
    )
