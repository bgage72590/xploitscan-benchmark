import sqlite3
from flask import request

def get_user(db: sqlite3.Connection):
    uid = request.args.get("id")
    # Parameterized query — value bound, not interpolated. SQLi must NOT fire.
    return db.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()
