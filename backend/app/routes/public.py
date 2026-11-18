
from flask import Blueprint, jsonify, request
from ..models import Series, Soiree, Tafsir, Event, Surah, ContactSubmission
from ..extensions import db
from flask import jsonify, request, current_app
import os
import smtplib
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


# =====================================================
# SOURATES (pour les formulaires et le contenu public)
# =====================================================

@public_bp.get("/surahs")
def get_surahs():
    items = Surah.query.order_by(Surah.number.asc()).all()
    return jsonify([item.to_dict() for item in items])


# =====================================================
# CONTACT
# =====================================================

from email.message import EmailMessage



@public_bp.post("/contact")
def create_contact():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    message = (data.get("message") or "").strip()

    if not all([name, email, phone, message]):
        return jsonify({
            "error": "Tous les champs sont obligatoires."
        }), 400

    if "\n" in email or "\r" in email:
        return jsonify({
            "error": "Adresse e-mail invalide."
        }), 400

    mail_username = current_app.config.get(
        "MAIL_USERNAME"
    ) or os.getenv("MAIL_USERNAME")

    mail_password = current_app.config.get(
        "MAIL_PASSWORD"
    ) or os.getenv("MAIL_PASSWORD")

    recipient = current_app.config.get(
        "MAIL_RECIPIENT"
    ) or os.getenv(
        "MAIL_RECIPIENT",
        "nouroulquran225@gmail.com",
    )

    if not mail_username or not mail_password:
        current_app.logger.error(
            "Configuration SMTP incomplète."
        )
        return jsonify({
            "error": "Le service d'envoi est momentanément indisponible."
        }), 503

    mail = EmailMessage()
    mail["Subject"] = f"Nouveau message du site Nouroul Qur’An — {name}"
    mail["From"] = mail_username
    mail["To"] = recipient
    mail["Reply-To"] = email

    mail.set_content(
        f"""Nouveau message reçu depuis le site Nouroul Qur’An.

Nom : {name}
Adresse e-mail : {email}
Téléphone : {phone}

Message :
{message}
"""
    )

    try:
        with smtplib.SMTP(
            os.getenv("MAIL_SERVER", "smtp.gmail.com"),
            int(os.getenv("MAIL_PORT", "587")),
            timeout=20,
        ) as server:
            server.starttls()
            server.login(mail_username, mail_password)
            server.send_message(mail)

    except (OSError, smtplib.SMTPException):
        current_app.logger.exception(
            "Échec de l'envoi du formulaire de contact."
        )
        return jsonify({
            "error": "Impossible d'envoyer le message pour le moment."
        }), 502

    return jsonify({
        "message": "Votre message a bien été envoyé au club Nouroul Qur’An."
    }), 200
