import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from email_validator import EmailNotValidError, validate_email

from models import ContactSubmission, db

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", SMTP_USER)
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "changeme")

SUJETS_VALIDES = {
    "Rejoindre le club",
    "Question sur une soirée",
    "Partenariat / intervention",
    "Autre",
}


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'nouroul_quran.db')}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    allowed_origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    CORS(app, resources={r"/api/*": {"origins": allowed_origins.split(",")}})

    with app.app_context():
        db.create_all()

    register_routes(app)
    return app


def send_notification_email(submission: ContactSubmission):
    """Envoie un e-mail de notification. Échoue silencieusement (log) si le SMTP
    n'est pas configuré, pour ne jamais bloquer l'enregistrement en base."""
    if not (SMTP_HOST and SMTP_USER and SMTP_PASSWORD and NOTIFY_EMAIL):
        app_logger_warning("SMTP non configuré : e-mail de notification ignoré.")
        return

    msg = EmailMessage()
    msg["Subject"] = f"[Nouroul Qur'an] Nouveau message — {submission.sujet}"
    msg["From"] = SMTP_USER
    msg["To"] = NOTIFY_EMAIL
    msg["Reply-To"] = submission.email
    msg.set_content(
        f"Nouveau message reçu via le site Nouroul Qur'an\n\n"
        f"Nom : {submission.nom}\n"
        f"E-mail : {submission.email}\n"
        f"Téléphone : {submission.telephone or '—'}\n"
        f"Sujet : {submission.sujet}\n\n"
        f"Message :\n{submission.message}\n"
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


def app_logger_warning(message: str):
    print(f"[WARN] {message}")


def register_routes(app):
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.post("/api/contact")
    def create_contact():
        data = request.get_json(silent=True) or {}

        nom = (data.get("nom") or "").strip()
        email = (data.get("email") or "").strip()
        telephone = (data.get("telephone") or "").strip() or None
        sujet = (data.get("sujet") or "Autre").strip()
        message = (data.get("message") or "").strip()

        errors = {}
        if not nom:
            errors["nom"] = "Le nom est requis."
        if not message:
            errors["message"] = "Le message est requis."
        if sujet not in SUJETS_VALIDES:
            sujet = "Autre"

        try:
            valid = validate_email(email, check_deliverability=False)
            email = valid.normalized
        except EmailNotValidError:
            errors["email"] = "Adresse e-mail invalide."

        if errors:
            return jsonify({"error": "Formulaire invalide.", "fields": errors}), 400

        submission = ContactSubmission(
            nom=nom, email=email, telephone=telephone, sujet=sujet, message=message
        )
        db.session.add(submission)
        db.session.commit()

        try:
            send_notification_email(submission)
        except Exception as exc:  # noqa: BLE001
            app_logger_warning(f"Échec de l'envoi de l'e-mail : {exc}")

        return jsonify({"success": True, "id": submission.id}), 201

    @app.get("/api/contact")
    def list_contacts():
        if request.headers.get("X-Admin-Key") != ADMIN_API_KEY:
            return jsonify({"error": "Non autorisé."}), 401

        submissions = ContactSubmission.query.order_by(
            ContactSubmission.created_at.desc()
        ).all()
        return jsonify([s.to_dict() for s in submissions])


if __name__ == "__main__":
    application = create_app()
    application.run(debug=True, port=int(os.getenv("PORT", "5000")))
