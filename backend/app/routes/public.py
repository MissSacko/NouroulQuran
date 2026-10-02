from flask import Blueprint, jsonify
from app.extensions import db
from app.models import Series, Soiree, Tafsir, Event

public_bp = Blueprint("public", __name__, url_prefix="/api")


@public_bp.get("/events")
def get_events():
    events = Event.query.order_by(Event.date.asc()).all()

    return jsonify([
        event.to_dict()
        for event in events
        if event.is_published
    ])


@public_bp.get("/events/upcoming")
def get_upcoming_events():
    from datetime import date

    events = (
        Event.query
        .filter(
            Event.is_published == True,
            Event.date >= date.today()
        )
        .order_by(Event.date.asc())
        .all()
    )

    return jsonify([
        event.to_dict()
        for event in events
    ])


@public_bp.get("/events/<slug>")
def get_event(slug):
    event = Event.query.filter_by(
        slug=slug,
        is_published=True
    ).first()

    if not event:
        return jsonify({"error": "Événement introuvable"}), 404

    return jsonify(event.to_dict())