from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import (
    Series,
    Soiree,
    Tafsir,
    ContactSubmission,
)


public_bp = Blueprint("public", __name__)


# ============================================================
# SERIES
# ============================================================

@public_bp.get("/series")
def get_series():
    series = (
        Series.query
        .filter_by(is_published=True)
        .order_by(Series.created_at.desc())
        .all()
    )

    return jsonify([
        serie.to_dict(include_soirees=True)
        for serie in series
    ])


@public_bp.get("/series/<slug>")
def get_serie(slug):
    serie = (
        Series.query
        .filter_by(
            slug=slug,
            is_published=True,
        )
        .first()
    )

    if not serie:
        return jsonify({
            "error": "Série introuvable"
        }), 404

    return jsonify(
        serie.to_dict(include_soirees=True)
    )


# ============================================================
# SOIRÉES
# ============================================================

@public_bp.get("/soirees")
def get_soirees():
    query = Soiree.query.filter_by(
        is_published=True
    )

    series_slug = request.args.get("series")
    category = request.args.get("category")

    if series_slug:
        query = (
            query
            .join(Series)
            .filter(Series.slug == series_slug)
        )

    if category:
        query = query.filter(
            Soiree.category == category
        )

    soirees = (
        query
        .order_by(Soiree.date.desc())
        .all()
    )

    return jsonify([
        soiree.to_dict()
        for soiree in soirees
    ])


@public_bp.get("/soirees/<slug>")
def get_soiree(slug):
    soiree = (
        Soiree.query
        .filter_by(
            slug=slug,
            is_published=True,
        )
        .first()
    )

    if not soiree:
        return jsonify({
            "error": "Soirée introuvable"
        }), 404

    return jsonify(
        soiree.to_dict(include_media=True)
    )


# ============================================================
# TAFSIRS
# ============================================================

@public_bp.get("/tafsirs")
def get_tafsirs():
    tafsirs = (
        Tafsir.query
        .filter_by(is_published=True)
        .order_by(Tafsir.date.desc())
        .all()
    )

    return jsonify([
        tafsir.to_dict()
        for tafsir in tafsirs
    ])


@public_bp.get("/tafsirs/<slug>")
def get_tafsir(slug):
    tafsir = (
        Tafsir.query
        .filter_by(
            slug=slug,
            is_published=True,
        )
        .first()
    )

    if not tafsir:
        return jsonify({
            "error": "Tafsir introuvable"
        }), 404

    return jsonify(
        tafsir.to_dict()
    )


# ============================================================
# CONTACT
# ============================================================

@public_bp.post("/contact")
def create_contact():
    data = request.get_json() or {}

    name = data.get("name")
    message = data.get("message")

    if not name or not message:
        return jsonify({
            "error": "Le nom et le message sont obligatoires."
        }), 400

    contact = ContactSubmission(
        name=name,
        email=data.get("email"),
        phone=data.get("phone"),
        message=message,
    )

    db.session.add(contact)
    db.session.commit()

    return jsonify({
        "message": "Votre message a bien été envoyé."
    }), 201