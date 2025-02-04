from flask import request, render_template,Blueprint
from models.db import DBconnection,sqlite3

bp=Blueprint('/search',__name__)
db_path = '/home/boss/TheFool/TheFool/Blog/Articles.db'

@bp.route('/search')
def search():
    try:
        with DBconnection('Articles.db') as cusor:
            q = request.args.get('q')
            conn = sqlite3.connect(db_path)
            param=({q},{q},)
            query = f"SELECT * FROM articles WHERE title LIKE '%?%' OR content LIKE '%?%'"
            result = cusor.execute(query,param)
            articles = [dict(title=row[0], content=row[1]) for row in result]
            
    except sqlite3.Error as error:
            print("Error retreivin article",error)

    return render_template('search_results.html', articles=articles)
