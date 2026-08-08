from flask import Blueprint, request, jsonify
from database.db import db
from models.tournament import Tournament

tournament = Blueprint("tournament", __name__)


# CREATE TOURNAMENT
@tournament.route("/tournaments", methods=["POST"])
def create_tournament():
    data = request.get_json()

    new_tournament = Tournament(
        name=data.get("name"),
        game=data.get("game"),
        description=data.get("description"),
        start_date=data.get("start_date"),
        status=data.get("status", "Upcoming")
    )

    db.session.add(new_tournament)
    db.session.commit()

    return jsonify({
        "message": "Tournament Created Successfully"
    }), 201


# GET ALL TOURNAMENTS
@tournament.route("/tournaments", methods=["GET"])
def get_tournaments():
    tournaments = Tournament.query.all()

    return jsonify([
        {
            "id": t.id,
            "name": t.name,
            "game": t.game,
            "description": t.description,
            "start_date": t.start_date,
            "status": t.status
        }
        for t in tournaments
    ]), 200


# UPDATE TOURNAMENT
@tournament.route("/tournaments/<int:id>", methods=["PUT"])
def update_tournament(id):
    tournament_data = Tournament.query.get(id)

    if not tournament_data:
        return jsonify({
            "message": "Tournament not found"
        }), 404

    data = request.get_json()

    tournament_data.name = data.get(
        "name", tournament_data.name
    )

    tournament_data.game = data.get(
        "game", tournament_data.game
    )

    tournament_data.description = data.get(
        "description", tournament_data.description
    )

    tournament_data.start_date = data.get(
        "start_date", tournament_data.start_date
    )

    tournament_data.status = data.get(
        "status", tournament_data.status
    )

    db.session.commit()

    return jsonify({
        "message": "Tournament Updated Successfully"
    }), 200


# GET TOURNAMENT BY ID
@tournament.route("/tournaments/<int:id>", methods=["GET"])
def get_tournament(id):
    tournament_data = Tournament.query.get(id)

    if not tournament_data:
        return jsonify({
            "message": "Tournament not found"
        }), 404

    return jsonify({
        "id": tournament_data.id,
        "name": tournament_data.name,
        "game": tournament_data.game,
        "description": tournament_data.description,
        "start_date": tournament_data.start_date,
        "status": tournament_data.status
    }), 200


# DELETE TOURNAMENT
@tournament.route("/tournaments/<int:id>", methods=["DELETE"])
def delete_tournament(id):
    tournament_data = Tournament.query.get(id)

    if not tournament_data:
        return jsonify({
            "message": "Tournament not found"
        }), 404

    db.session.delete(tournament_data)
    db.session.commit()

    return jsonify({
        "message": "Tournament Deleted Successfully"
    }), 200