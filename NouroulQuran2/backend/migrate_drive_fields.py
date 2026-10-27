"""Ajoute les champs Drive et éditoriaux sans supprimer les données existantes.
Lancer depuis backend/: python migrate_drive_fields.py
"""
from sqlalchemy import inspect, text
from app import create_app
from app.extensions import db

COLUMNS = {
    "series": {
        "introduction": "TEXT NULL",
        "objectives": "JSON NULL",
        "drive_folder_url": "VARCHAR(1000) NULL",
    },
    "soirees": {
        "recording_available": "BOOLEAN NOT NULL DEFAULT FALSE",
        "recording_url": "VARCHAR(1000) NULL",
    },
}

app = create_app()
with app.app_context():
    db.create_all()  # crée uniquement les tables absentes, sans effacer les données
    inspector = inspect(db.engine)
    existing_tables = set(inspector.get_table_names())
    for table, columns in COLUMNS.items():
        if table not in existing_tables:
            print(f"Table {table!r} absente : elle sera créée par flask db upgrade ou db.create_all().")
            continue
        existing_columns = {column["name"] for column in inspector.get_columns(table)}
        for name, sql_type in columns.items():
            if name in existing_columns:
                print(f"OK — {table}.{name} existe déjà")
                continue
            statement = f'ALTER TABLE "{table}" ADD COLUMN "{name}" {sql_type}'
            with db.engine.begin() as connection:
                connection.execute(text(statement))
            print(f"Ajouté — {table}.{name}")
    print("Migration terminée. Aucune donnée existante n’a été supprimée.")
