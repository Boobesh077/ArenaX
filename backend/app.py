from routes.auth import auth
from routes.tournament import tournament
from flask import Flask
from flask_cors import CORS
from config import Config
from database.db import db
from models.user import User
from models.tournament import Tournament

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

app.register_blueprint(auth)
app.register_blueprint(tournament)

db.init_app(app)


@app.route("/")
def home():
    return {
        "message": "ArenaX Backend Running"
    }


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)