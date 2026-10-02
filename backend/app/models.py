from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from .extensions import db


# ============================================================
# TIMESTAMPS
# ============================================================

class TimestampMixin:
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# USERS
# ============================================================

class User(TimestampMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(255),
        nullable=False,
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False,
    )

    role = db.Column(
        db.String(50),
        default="editor",
        nullable=False,
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False,
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password,
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
        }


# ============================================================
# SERIES
# ============================================================

class Series(TimestampMixin, db.Model):
    __tablename__ = "series"

    id = db.Column(db.Integer, primary_key=True)

    slug = db.Column(
        db.String(150),
        unique=True,
        nullable=False,
    )

    title = db.Column(
        db.String(255),
        nullable=False,
    )

    subtitle = db.Column(
        db.String(500),
        nullable=True,
    )

    description = db.Column(
        db.Text,
        nullable=True,
    )

    category = db.Column(
        db.String(150),
        nullable=True,
    )

    # URL MinIO / AWS S3
    cover_image = db.Column(
        db.String(1000),
        nullable=True,
    )

    is_published = db.Column(
        db.Boolean,
        default=True,
        nullable=False,
    )

    soirees = db.relationship(
        "Soiree",
        back_populates="series",
        lazy=True,
    )

    def to_dict(self, include_soirees=False):
        data = {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "subtitle": self.subtitle,
            "description": self.description,
            "category": self.category,
            "cover_image": self.cover_image,
            "is_published": self.is_published,
        }

        if include_soirees:
            data["soirees"] = [
                soiree.to_dict()
                for soiree in self.soirees
                if soiree.is_published
            ]

        return data


# ============================================================
# SOIRÉES
# ============================================================

class Soiree(TimestampMixin, db.Model):
    __tablename__ = "soirees"

    id = db.Column(db.Integer, primary_key=True)

    # Numéro éditorial : 1, 2, 3... 22...
    number = db.Column(
        db.Integer,
        unique=True,
        nullable=True,
    )

    slug = db.Column(
        db.String(150),
        unique=True,
        nullable=False,
    )

    title = db.Column(
        db.String(255),
        nullable=False,
    )

    subtitle = db.Column(
        db.String(500),
        nullable=True,
    )

    date = db.Column(
        db.Date,
        nullable=True,
    )

    speaker = db.Column(
        db.String(255),
        nullable=True,
    )

    category = db.Column(
        db.String(150),
        nullable=True,
    )

    summary = db.Column(
        db.Text,
        nullable=True,
    )

    description = db.Column(
        db.Text,
        nullable=True,
    )

    # URL de l'affiche dans MinIO / AWS S3
    cover_image = db.Column(
        db.String(1000),
        nullable=True,
    )

    is_published = db.Column(
        db.Boolean,
        default=True,
        nullable=False,
    )

    # Relation avec une série
    series_id = db.Column(
        db.Integer,
        db.ForeignKey("series.id"),
        nullable=True,
    )

    series = db.relationship(
        "Series",
        back_populates="soirees",
    )

    # Médias
    media = db.relationship(
        "Media",
        back_populates="soiree",
        cascade="all, delete-orphan",
    )

    def to_dict(self, include_media=False):
        data = {
            "id": self.id,
            "number": self.number,
            "slug": self.slug,
            "title": self.title,
            "subtitle": self.subtitle,
            "date": self.date.isoformat() if self.date else None,
            "speaker": self.speaker,
            "category": self.category,
            "summary": self.summary,
            "description": self.description,
            "cover_image": self.cover_image,
            "is_published": self.is_published,
            "series": (
                {
                    "id": self.series.id,
                    "slug": self.series.slug,
                    "title": self.series.title,
                }
                if self.series
                else None
            ),
        }

        if include_media:
            data["media"] = [
                item.to_dict()
                for item in self.media
            ]

        return data


# ============================================================
# SOURATES
# ============================================================

class Surah(TimestampMixin, db.Model):
    __tablename__ = "surahs"

    id = db.Column(db.Integer, primary_key=True)

    number = db.Column(
        db.Integer,
        unique=True,
        nullable=False,
    )

    name = db.Column(
        db.String(150),
        unique=True,
        nullable=False,
    )

    verse_count = db.Column(
        db.Integer,
        nullable=True,
    )

    revelation_order = db.Column(
        db.Integer,
        nullable=True,
    )

    revelation_type = db.Column(
        db.String(50),
        nullable=True,
    )

    appellation_reason = db.Column(
        db.Text,
        nullable=True,
    )

    tafsirs = db.relationship(
        "Tafsir",
        back_populates="surah",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "number": self.number,
            "name": self.name,
            "verse_count": self.verse_count,
            "revelation_order": self.revelation_order,
            "revelation_type": self.revelation_type,
            "appellation_reason": self.appellation_reason,
        }


# ============================================================
# TAFSIR
# ============================================================

class Tafsir(TimestampMixin, db.Model):
    __tablename__ = "tafsirs"

    id = db.Column(db.Integer, primary_key=True)

    slug = db.Column(
        db.String(150),
        unique=True,
        nullable=False,
    )

    date = db.Column(
        db.Date,
        nullable=True,
    )

    intervenant = db.Column(
        db.String(255),
        nullable=True,
    )

    organisateur = db.Column(
        db.String(255),
        nullable=True,
    )

    lieu = db.Column(
        db.String(255),
        nullable=True,
    )

    mosquee = db.Column(
        db.String(255),
        nullable=True,
    )

    description = db.Column(
        db.Text,
        nullable=True,
    )

    contexte_revelation = db.Column(
        db.Text,
        nullable=True,
    )

    themes_principaux = db.Column(
        db.JSON,
        nullable=True,
    )

    termes_cles = db.Column(
        db.JSON,
        nullable=True,
    )

    explication = db.Column(
        db.Text,
        nullable=True,
    )

    lecons_pratiques = db.Column(
        db.JSON,
        nullable=True,
    )

    # URL éventuelle d'une image/affiche
    cover_image = db.Column(
        db.String(1000),
        nullable=True,
    )

    is_published = db.Column(
        db.Boolean,
        default=True,
        nullable=False,
    )

    surah_id = db.Column(
        db.Integer,
        db.ForeignKey("surahs.id"),
        nullable=True,
    )

    surah = db.relationship(
        "Surah",
        back_populates="tafsirs",
    )

    media = db.relationship(
        "Media",
        back_populates="tafsir",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "date": self.date.isoformat() if self.date else None,
            "intervenant": self.intervenant,
            "organisateur": self.organisateur,
            "lieu": self.lieu,
            "mosquee": self.mosquee,
            "description": self.description,
            "contexte_revelation": self.contexte_revelation,
            "themes_principaux": self.themes_principaux or [],
            "termes_cles": self.termes_cles or [],
            "explication": self.explication,
            "lecons_pratiques": self.lecons_pratiques or [],
            "cover_image": self.cover_image,
            "is_published": self.is_published,
            "surah": self.surah.to_dict() if self.surah else None,
        }


# ============================================================
# EVENTS
# ============================================================

class Event(TimestampMixin, db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)

    slug = db.Column(
        db.String(150),
        unique=True,
        nullable=False,
    )

    title = db.Column(
        db.String(255),
        nullable=False,
    )

    description = db.Column(
        db.Text,
        nullable=True,
    )

    date = db.Column(
        db.Date,
        nullable=False,
    )

    start_time = db.Column(
        db.Time,
        nullable=True,
    )

    end_time = db.Column(
        db.Time,
        nullable=True,
    )

    location = db.Column(
        db.String(500),
        nullable=True,
    )

    # URL de l'affiche dans MinIO / AWS S3
    cover_image = db.Column(
        db.String(1000),
        nullable=True,
    )

    registration_enabled = db.Column(
        db.Boolean,
        default=False,
        nullable=False,
    )

    registration_url = db.Column(
        db.String(1000),
        nullable=True,
    )

    countdown_enabled = db.Column(
        db.Boolean,
        default=False,
        nullable=False,
    )

    is_published = db.Column(
        db.Boolean,
        default=True,
        nullable=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "description": self.description,
            "date": self.date.isoformat() if self.date else None,
            "start_time": (
                self.start_time.strftime("%H:%M")
                if self.start_time
                else None
            ),
            "end_time": (
                self.end_time.strftime("%H:%M")
                if self.end_time
                else None
            ),
            "location": self.location,
            "cover_image": self.cover_image,
            "registration_enabled": self.registration_enabled,
            "registration_url": self.registration_url,
            "countdown_enabled": self.countdown_enabled,
            "is_published": self.is_published,
        }


# ============================================================
# MEDIA
# ============================================================

class Media(TimestampMixin, db.Model):
    __tablename__ = "media"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(
        db.String(255),
        nullable=True,
    )

    media_type = db.Column(
        db.String(50),
        nullable=False,
    )

    # URL MinIO / AWS S3 / YouTube / autre
    url = db.Column(
        db.String(1000),
        nullable=False,
    )

    thumbnail = db.Column(
        db.String(1000),
        nullable=True,
    )

    soiree_id = db.Column(
        db.Integer,
        db.ForeignKey("soirees.id"),
        nullable=True,
    )

    tafsir_id = db.Column(
        db.Integer,
        db.ForeignKey("tafsirs.id"),
        nullable=True,
    )

    event_id = db.Column(
        db.Integer,
        db.ForeignKey("events.id"),
        nullable=True,
    )

    soiree = db.relationship(
        "Soiree",
        back_populates="media",
    )

    tafsir = db.relationship(
        "Tafsir",
        back_populates="media",
    )

    event = db.relationship(
        "Event",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "media_type": self.media_type,
            "url": self.url,
            "thumbnail": self.thumbnail,
        }


# ============================================================
# CONTACT
# ============================================================

class ContactSubmission(TimestampMixin, db.Model):
    __tablename__ = "contact_submissions"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(255),
        nullable=False,
    )

    email = db.Column(
        db.String(255),
        nullable=True,
    )

    phone = db.Column(
        db.String(50),
        nullable=True,
    )

    message = db.Column(
        db.Text,
        nullable=False,
    )

    is_processed = db.Column(
        db.Boolean,
        default=False,
        nullable=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "message": self.message,
            "is_processed": self.is_processed,
        }