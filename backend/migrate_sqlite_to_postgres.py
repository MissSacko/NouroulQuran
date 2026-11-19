
from pathlib import Path

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

from app import create_app
from app.extensions import db
from app.models import (
    User, Series, Soiree, Surah, Tafsir, Event, Media,
    ContactSubmission,
)

MODELS = [
    User, Series, Surah, Event,
    Soiree, Tafsir, Media, ContactSubmission,
]

TABLES = [model.__tablename__ for model in MODELS]

app = create_app()
sqlite_path = Path(__file__).parent / "instance" / "nouroul_quran.db"

with app.app_context():
    source_engine = create_engine(f"sqlite:///{sqlite_path}")
    SourceSession = sessionmaker(bind=source_engine)
    source_session = SourceSession()

    try:
        # Vérifier que Neon est vide
        for model in MODELS:
            count = db.session.query(model).count()
            if count != 0:
                raise RuntimeError(
                    f"La table {model.__tablename__} n'est pas vide."
                )

        # Transférer les données dans l'ordre des dépendances
        for model in MODELS:
            rows = source_session.query(model).all()
            data = [
                {
                    column.key: getattr(row, column.key)
                    for column in model.__table__.columns
                }
                for row in rows
            ]

            if data:
                db.session.add_all([model(**item) for item in data])

            print(f"{model.__tablename__}: {len(data)} lignes préparées")

        db.session.flush()

        # Réinitialiser les séquences des identifiants PostgreSQL
        for table in TABLES:
            db.session.execute(text(f"""
                SELECT setval(
                    pg_get_serial_sequence('{table}', 'id'),
                    COALESCE((SELECT MAX(id) FROM {table}), 1),
                    (SELECT COUNT(*) FROM {table}) > 0
                )
            """))

        db.session.commit()
        print("\nTransfert terminé avec succès !")

    except Exception:
        db.session.rollback()
        raise

    finally:
        source_session.close()
        source_engine.dispose()
