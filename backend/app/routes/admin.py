from datetime import date, time

from flask import Blueprint, jsonify, request

from ..config import Config
from ..extensions import db
from ..models import (
    Series,
    Soiree,
    Tafsir,
    Surah,
    Event,
)


admin_bp = Blueprint("admin", __name__)


# ============================================================
# AUTH
# ============================================================

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
# HELPERS
# ============================================================

def parse_date(value):
    if not value:
        return None

    try:
        return date.fromisoformat(value)
    except (ValueError, TypeError):
        return None


def parse_time(value):
    if not value:
        return None

    try:
        return time.fromisoformat(value)
    except (ValueError, TypeError):
        return None


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

    if Series.query.filter_by(slug=data["slug"]).first():
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
        is_published=data.get("is_published", True),
    )

    db.session.add(serie)
    db.session.commit()

    return jsonify(serie.to_dict()), 201


@admin_bp.put("/series/<int:series_id>")
def update_series(series_id):

    if not check_admin_key():
        return unauthorized()

    serie = db.session.get(Series, series_id)

    if not serie:
        return jsonify({
            "error": "Série introuvable."
        }), 404

    data = request.get_json() or {}

    if "slug" in data and data["slug"] != serie.slug:
        existing = Series.query.filter_by(
            slug=data["slug"]
        ).first()

        if existing:
            return jsonify({
                "error": "Ce slug existe déjà."
            }), 409

        serie.slug = data["slug"]

    fields = [
        "title",
        "subtitle",
        "description",
        "category",
        "cover_image",
        "is_published",
    ]

    for field in fields:
        if field in data:
            setattr(serie, field, data[field])

    db.session.commit()

    return jsonify(serie.to_dict())


@admin_bp.delete("/series/<int:series_id>")
def delete_series(series_id):

    if not check_admin_key():
        return unauthorized()

    serie = db.session.get(Series, series_id)

    if not serie:
        return jsonify({
            "error": "Série introuvable."
        }), 404

    # On ne supprime pas les soirées.
    # Elles deviennent simplement des soirées sans série.
    for soiree in serie.soirees:
        soiree.series_id = None

    db.session.delete(serie)
    db.session.commit()

    return jsonify({
        "message": "Série supprimée."
    })


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

    if Soiree.query.filter_by(slug=data["slug"]).first():
        return jsonify({
            "error": "Cette soirée existe déjà."
        }), 409

    # Numéro éditorial
    number = data.get("number")

    if number is not None:
        if Soiree.query.filter_by(number=number).first():
            return jsonify({
                "error": "Ce numéro de soirée existe déjà."
            }), 409

    # Série
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

    # Date
    soiree_date = parse_date(data.get("date"))

    if data.get("date") and not soiree_date:
        return jsonify({
            "error": "Format de date invalide. Utilisez YYYY-MM-DD."
        }), 400

    soiree = Soiree(
        number=number,
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
        is_published=data.get("is_published", True),
    )

    db.session.add(soiree)
    db.session.commit()

    return jsonify(
        soiree.to_dict()
    ), 201


@admin_bp.put("/soirees/<int:soiree_id>")
def update_soiree(soiree_id):

    if not check_admin_key():
        return unauthorized()

    soiree = db.session.get(
        Soiree,
        soiree_id,
    )

    if not soiree:
        return jsonify({
            "error": "Soirée introuvable."
        }), 404

    data = request.get_json() or {}

    # Slug
    if "slug" in data and data["slug"] != soiree.slug:

        existing = Soiree.query.filter_by(
            slug=data["slug"]
        ).first()

        if existing:
            return jsonify({
                "error": "Ce slug existe déjà."
            }), 409

        soiree.slug = data["slug"]

    # Numéro
    if "number" in data:

        number = data["number"]

        if number is not None:

            existing = Soiree.query.filter(
                Soiree.number == number,
                Soiree.id != soiree.id,
            ).first()

            if existing:
                return jsonify({
                    "error": "Ce numéro de soirée existe déjà."
                }), 409

        soiree.number = number

    # Série
    if "series_id" in data:

        if data["series_id"] is None:

            soiree.series_id = None

        else:

            series = db.session.get(
                Series,
                data["series_id"],
            )

            if not series:
                return jsonify({
                    "error": "Série introuvable."
                }), 404

            soiree.series_id = series.id

    # Date
    if "date" in data:

        if data["date"]:

            parsed_date = parse_date(
                data["date"]
            )

            if not parsed_date:
                return jsonify({
                    "error": (
                        "Format de date invalide. "
                        "Utilisez YYYY-MM-DD."
                    )
                }), 400

            soiree.date = parsed_date

        else:

            soiree.date = None

    fields = [
        "title",
        "subtitle",
        "speaker",
        "category",
        "summary",
        "description",
        "cover_image",
        "is_published",
    ]

    for field in fields:
        if field in data:
            setattr(
                soiree,
                field,
                data[field],
            )

    db.session.commit()

    return jsonify(
        soiree.to_dict()
    )


@admin_bp.delete("/soirees/<int:soiree_id>")
def delete_soiree(soiree_id):

    if not check_admin_key():
        return unauthorized()

    soiree = db.session.get(
        Soiree,
        soiree_id,
    )

    if not soiree:
        return jsonify({
            "error": "Soirée introuvable."
        }), 404

    db.session.delete(soiree)
    db.session.commit()

    return jsonify({
        "message": "Soirée supprimée."
    })


# ============================================================
# TAFSIRS
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

    if Tafsir.query.filter_by(
        slug=data["slug"]
    ).first():

        return jsonify({
            "error": "Ce Tafsir existe déjà."
        }), 409

    tafsir_date = parse_date(
        data.get("date")
    )

    if data.get("date") and not tafsir_date:
        return jsonify({
            "error": "Format de date invalide. Utilisez YYYY-MM-DD."
        }), 400

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
        cover_image=data.get("cover_image"),
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


@admin_bp.put("/tafsirs/<int:tafsir_id>")
def update_tafsir(tafsir_id):

    if not check_admin_key():
        return unauthorized()

    tafsir = db.session.get(
        Tafsir,
        tafsir_id,
    )

    if not tafsir:
        return jsonify({
            "error": "Tafsir introuvable."
        }), 404

    data = request.get_json() or {}

    if "slug" in data and data["slug"] != tafsir.slug:

        existing = Tafsir.query.filter_by(
            slug=data["slug"]
        ).first()

        if existing:
            return jsonify({
                "error": "Ce slug existe déjà."
            }), 409

        tafsir.slug = data["slug"]

    if "date" in data:

        if data["date"]:

            parsed_date = parse_date(
                data["date"]
            )

            if not parsed_date:
                return jsonify({
                    "error": (
                        "Format de date invalide. "
                        "Utilisez YYYY-MM-DD."
                    )
                }), 400

            tafsir.date = parsed_date

        else:

            tafsir.date = None

    if "surah_id" in data:

        if data["surah_id"] is None:

            tafsir.surah_id = None

        else:

            surah = db.session.get(
                Surah,
                data["surah_id"],
            )

            if not surah:
                return jsonify({
                    "error": "Sourate introuvable."
                }), 404

            tafsir.surah_id = surah.id

    fields = [
        "intervenant",
        "organisateur",
        "lieu",
        "mosquee",
        "description",
        "contexte_revelation",
        "themes_principaux",
        "termes_cles",
        "explication",
        "lecons_pratiques",
        "cover_image",
        "is_published",
    ]

    for field in fields:
        if field in data:
            setattr(
                tafsir,
                field,
                data[field],
            )

    db.session.commit()

    return jsonify(
        tafsir.to_dict()
    )


@admin_bp.delete("/tafsirs/<int:tafsir_id>")
def delete_tafsir(tafsir_id):

    if not check_admin_key():
        return unauthorized()

    tafsir = db.session.get(
        Tafsir,
        tafsir_id,
    )

    if not tafsir:
        return jsonify({
            "error": "Tafsir introuvable."
        }), 404

    db.session.delete(tafsir)
    db.session.commit()

    return jsonify({
        "message": "Tafsir supprimé."
    })


# ============================================================
# EVENTS
# ============================================================

@admin_bp.post("/events")
def create_event():

    if not check_admin_key():
        return unauthorized()

    data = request.get_json() or {}

    if not data.get("title") or not data.get("slug"):
        return jsonify({
            "error": "title et slug sont obligatoires."
        }), 400

    if Event.query.filter_by(
        slug=data["slug"]
    ).first():

        return jsonify({
            "error": "Cet événement existe déjà."
        }), 409

    event_date = parse_date(
        data.get("date")
    )

    if not event_date:
        return jsonify({
            "error": "La date de l'événement est obligatoire."
        }), 400

    start_time = parse_time(
        data.get("start_time")
    )

    end_time = parse_time(
        data.get("end_time")
    )

    event = Event(
        title=data["title"],
        slug=data["slug"],
        description=data.get("description"),
        date=event_date,
        start_time=start_time,
        end_time=end_time,
        location=data.get("location"),
        cover_image=data.get("cover_image"),
        registration_enabled=data.get(
            "registration_enabled",
            False,
        ),
        registration_url=data.get(
            "registration_url"
        ),
        countdown_enabled=data.get(
            "countdown_enabled",
            False,
        ),
        is_published=data.get(
            "is_published",
            True,
        ),
    )

    db.session.add(event)
    db.session.commit()

    return jsonify(
        event.to_dict()
    ), 201


@admin_bp.put("/events/<int:event_id>")
def update_event(event_id):

    if not check_admin_key():
        return unauthorized()

    event = db.session.get(
        Event,
        event_id,
    )

    if not event:
        return jsonify({
            "error": "Événement introuvable."
        }), 404

    data = request.get_json() or {}

    if "slug" in data and data["slug"] != event.slug:

        existing = Event.query.filter_by(
            slug=data["slug"]
        ).first()

        if existing:
            return jsonify({
                "error": "Ce slug existe déjà."
            }), 409

        event.slug = data["slug"]

    if "date" in data:

        parsed_date = parse_date(
            data["date"]
        )

        if not parsed_date:
            return jsonify({
                "error": "Format de date invalide. Utilisez YYYY-MM-DD."
            }), 400

        event.date = parsed_date

    if "start_time" in data:
        event.start_time = parse_time(
            data["start_time"]
        )

    if "end_time" in data:
        event.end_time = parse_time(
            data["end_time"]
        )

    fields = [
        "title",
        "description",
        "location",
        "cover_image",
        "registration_enabled",
        "registration_url",
        "countdown_enabled",
        "is_published",
    ]

    for field in fields:
        if field in data:
            setattr(
                event,
                field,
                data[field],
            )

    db.session.commit()

    return jsonify(
        event.to_dict()
    )


@admin_bp.delete("/events/<int:event_id>")
def delete_event(event_id):

    if not check_admin_key():
        return unauthorized()

    event = db.session.get(
        Event,
        event_id,
    )

    if not event:
        return jsonify({
            "error": "Événement introuvable."
        }), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({
        "message": "Événement supprimé."
    })