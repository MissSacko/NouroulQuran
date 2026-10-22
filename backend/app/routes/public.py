
from flask import Blueprint, jsonify, request
from app.models import Series, Soiree, Tafsir, Event

public_bp = Blueprint("public", __name__, url_prefix="/api")


# =====================================================
# SÉRIES
# =====================================================

@public_bp.get("/series")
def get_series():
    series = Series.query.filter_by(
        is_published=True
    ).order_by(Series.id.desc()).all()

    return jsonify([item.to_dict() for item in series])


@public_bp.get("/series/<slug>")
def get_serie(slug):
    item = Series.query.filter_by(
        slug=slug,
        is_published=True
    ).first()

    if not item:
        return jsonify({"error": "Série introuvable"}), 404

    return jsonify(item.to_dict())


# =====================================================
# SOIRÉES
# =====================================================

@public_bp.get("/soirees")
def get_soirees():
    query = Soiree.query.filter_by(is_published=True)

    series_slug = request.args.get("series")
    category = request.args.get("category")

    if series_slug:
        serie = Series.query.filter_by(slug=series_slug).first()

        if not serie:
            return jsonify([])

        query = query.filter_by(series_id=serie.id)

    if category:
        query = query.filter_by(category=category)

    items = query.order_by(
        Soiree.number.asc(),
        Soiree.date.desc()
    ).all()

    return jsonify([item.to_dict() for item in items])


@public_bp.get("/soirees/<slug>")
def get_soiree(slug):
    item = Soiree.query.filter_by(
        slug=slug,
        is_published=True
    ).first()

    if not item:
        return jsonify({"error": "Soirée introuvable"}), 404

    return jsonify(item.to_dict())


# =====================================================
# TAFSIRS
# =====================================================

@public_bp.get("/tafsirs")
def get_tafsirs():
    items = Tafsir.query.filter_by(
        is_published=True
    ).order_by(Tafsir.date.desc()).all()

    return jsonify([item.to_dict() for item in items])


@public_bp.get("/tafsirs/<slug>")
def get_tafsir(slug):
    item = Tafsir.query.filter_by(
        slug=slug,
        is_published=True
    ).first()

    if not item:
        return jsonify({"error": "Tafsir introuvable"}), 404

    return jsonify(item.to_dict())


# =====================================================
# ÉVÉNEMENTS
# =====================================================

@public_bp.get("/events")
def get_events():
    items = Event.query.filter_by(
        is_published=True
    ).order_by(Event.date.asc()).all()

    return jsonify([item.to_dict() for item in items])


@public_bp.get("/events/upcoming")
def get_upcoming_events():
    from datetime import date

    items = Event.query.filter(
        Event.is_published.is_(True),
        Event.date >= date.today()
    ).order_by(Event.date.asc()).all()

    return jsonify([item.to_dict() for item in items])


@public_bp.get("/events/<slug>")
def get_event(slug):
    item = Event.query.filter_by(
        slug=slug,
        is_published=True
    ).first()

    if not item:
        return jsonify({"error": "Événement introuvable"}), 404

    return jsonify(item.to_dict())
