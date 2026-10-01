from datetime import date

from flask import Blueprint, jsonify, request

from ..config import Config
from ..extensions import db
from ..models import (
    Series,
    Soiree,
    Tafsir,
    Surah,
)


admin_bp = Blueprint("admin", __name__)


def check_admin_key():
    provided_key = request.headers.get("X-Admin-Key")

    return (
        provided_key
        and provided_key == Config.ADMIN_API_KEY
    )


def unauthorized():
    return jsonify({
        "error": "Accès administrateur requis."
    }), 401


# ============================================================
# SERIES
# ============================================================

@admin_bp.post("/series")
def create_series():

    if not check_admin_key():
        return unauthorized()

    data = request.get_json() or {}

    if not data.get("title") or not data.get("slug"):
        return jsonify({
            "error": "title et slug sont obligatoires."
        }), 400

    existing = Series.query.filter_by(
        slug=data["slug"]
    ).first()

    if existing:
        return jsonify({
            "error": "Cette série existe déjà."
        }), 409

    serie = Series(
        title=data["title"],
        slug=data["slug"],
        subtitle=data.get("subtitle"),
        description=data.get("description"),
        category=data.get("category"),
        cover_image=data.get("cover_image"),
        is_published=data.get(
            "is_published",
            True,
        ),
    )

    db.session.add(serie)
    db.session.commit()

    return jsonify(
        serie.to_dict()
    ), 201


# ============================================================
# SOIRÉES
# ============================================================

@admin_bp.post("/soirees")
def create_soiree():

    if not check_admin_key():
        return unauthorized()

    data = request.get_json() or {}

    if not data.get("title") or not data.get("slug"):
        return jsonify({
            "error": "title et slug sont obligatoires."
        }), 400

    existing = Soiree.query.filter_by(
        slug=data["slug"]
    ).first()

    if existing:
        return jsonify({
            "error": "Cette soirée existe déjà."
        }), 409

    series = None

    if data.get("series_id"):
        series = db.session.get(
            Series,
            data["series_id"],
        )

        if not series:
            return jsonify({
                "error": "Série introuvable."
            }), 404

    soiree_date = None

    if data.get("date"):
        try:
            soiree_date = date.fromisoformat(
                data["date"]
            )
        except ValueError:
            return jsonify({
                "error": "Format de date invalide. Utilisez YYYY-MM-DD."
            }), 400

    soiree = Soiree(
        title=data["title"],
        slug=data["slug"],
        subtitle=data.get("subtitle"),
        date=soiree_date,
        speaker=data.get("speaker"),
        category=data.get("category"),
        summary=data.get("summary"),
        description=data.get("description"),
        cover_image=data.get("cover_image"),
        series=series,
        is_published=data.get(
            "is_published",
            True,
        ),
    )

    db.session.add(soiree)
    db.session.commit()

    return jsonify(
        soiree.to_dict()
    ), 201


# ============================================================
# TAFSIR
# ============================================================

@admin_bp.post("/tafsirs")
def create_tafsir():

    if not check_admin_key():
        return unauthorized()

    data = request.get_json() or {}

    if not data.get("slug"):
        return jsonify({
            "error": "slug obligatoire."
        }), 400

    existing = Tafsir.query.filter_by(
        slug=data["slug"]
    ).first()

    if existing:
        return jsonify({
            "error": "Ce Tafsir existe déjà."
        }), 409

    surah = None

    if data.get("surah_id"):
        surah = db.session.get(
            Surah,
            data["surah_id"],
        )

        if not surah:
            return jsonify({
                "error": "Sourate introuvable."
            }), 404

    tafsir_date = None

    if data.get("date"):
        try:
            tafsir_date = date.fromisoformat(
                data["date"]
            )
        except ValueError:
            return jsonify({
                "error": "Format de date invalide. Utilisez YYYY-MM-DD."
            }), 400

    tafsir = Tafsir(
        slug=data["slug"],
        date=tafsir_date,
        intervenant=data.get("intervenant"),
        organisateur=data.get("organisateur"),
        lieu=data.get("lieu"),
        mosquee=data.get("mosquee"),
        description=data.get("description"),
        contexte_revelation=data.get(
            "contexte_revelation"
        ),
        themes_principaux=data.get(
            "themes_principaux",
            [],
        ),
        termes_cles=data.get(
            "termes_cles",
            [],
        ),
        explication=data.get(
            "explication"
        ),
        lecons_pratiques=data.get(
            "lecons_pratiques",
            [],
        ),
        surah=surah,
        is_published=data.get(
            "is_published",
            True,
        ),
    )

    db.session.add(tafsir)
    db.session.commit()

    return jsonify(
        tafsir.to_dict()
    ), 201