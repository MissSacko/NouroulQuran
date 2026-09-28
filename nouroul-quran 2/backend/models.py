from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ContactSubmission(db.Model):
    __tablename__ = "contact_submissions"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    telephone = db.Column(db.String(50), nullable=True)
    sujet = db.Column(db.String(100), nullable=False, default="Autre")
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "email": self.email,
            "telephone": self.telephone,
            "sujet": self.sujet,
            "message": self.message,
            "created_at": self.created_at.isoformat(),
        }
