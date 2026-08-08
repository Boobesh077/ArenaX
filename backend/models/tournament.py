from database.db import db


class Tournament(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    game = db.Column(db.String(100), nullable=False)

    description = db.Column(db.String(500))

    start_date = db.Column(db.String(50))

    status = db.Column(db.String(50), default="Upcoming")