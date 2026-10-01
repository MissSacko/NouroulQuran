from datetime import date

from app import create_app
from app.extensions import db
from app.models import Series, Soiree


app = create_app()


series_data = [
    {
        "slug": "sur-les-traces-des-sahabas",
        "title": "Sur les traces des Sahabas",
        "subtitle": "À la découverte des grandes figures de l'Islam",
        "description": (
            "Une série de rencontres consacrée à la découverte "
            "de la vie, de la foi, du caractère et des enseignements "
            "des Sahabas et des grandes figures de l'Islam."
        ),
        "category": "Sahabas & grandes figures",
    },
    {
        "slug": "preparation-ramadan",
        "title": "Préparation Ramadan",
        "subtitle": "Préparer son cœur et son âme à accueillir Ramadan",
        "description": (
            "Une série de rencontres pour se préparer "
            "spirituellement au mois de Ramadan."
        ),
        "category": "Spiritualité & Ramadan",
    },
]


soirees_data = [
    {
        "slug": "lire-comprendre-vivre-coran",
        "title": "Lire, comprendre et vivre le Coran",
        "subtitle": "Trois niveaux d'interaction",
        "date": "2025-10-31",
        "speaker": "Imam Mohamed Loukou",
        "category": "Coran & compréhension",
        "summary": (
            "Une réflexion sur les trois niveaux d'interaction "
            "avec le Coran : le lire, le comprendre et le mettre en pratique."
        ),
    },
    {
        "slug": "sincerite-memorisation",
        "title": "La sincérité dans la mémorisation",
        "subtitle": "Ne pas apprendre pour impressionner",
        "date": "2025-11-07",
        "speaker": "Haidara Vassindou",
        "category": "Mémorisation",
        "summary": (
            "Une réflexion sur l'intention et la sincérité "
            "dans l'apprentissage et la mémorisation du Coran."
        ),
    },
    {
        "slug": "coran-relations",
        "title": "Vivre le Coran dans nos relations",
        "subtitle": "Douceur, justice et bienveillance",
        "date": "2025-11-14",
        "speaker": "Barry Bashir",
        "category": "Coran & vie quotidienne",
        "summary": (
            "Comment les enseignements du Coran peuvent-ils "
            "transformer notre manière de nous comporter avec les autres ?"
        ),
    },
    {
        "slug": "revelation-coran",
        "title": "La révélation",
        "subtitle": "Comment le Coran est descendu sur le Prophète ﷺ",
        "date": "2025-11-21",
        "speaker": "Doumbia Bilal",
        "category": "Coran",
        "summary": (
            "Une découverte du processus de révélation du Coran "
            "au Prophète Muhammad ﷺ."
        ),
    },
    {
        "slug": "coran-sunna",
        "title": "Le Coran et la Sunna",
        "subtitle": "Comment ils se complètent dans notre vie",
        "date": "2025-11-28",
        "speaker": "Imam Mohamed Loukou",
        "category": "Coran & Sunna",
        "summary": (
            "Comprendre la complémentarité entre le Coran "
            "et la Sunna dans la pratique de notre religion."
        ),
    },
    {
        "slug": "experiences-memorisation-coran",
        "title": "Partage d'expériences sur la mémorisation du Coran",
        "date": "2025-12-14",
        "speaker": "Ibrahim Nouh",
        "category": "Mémorisation",
        "summary": (
            "Un moment de partage autour des expériences, "
            "difficultés et conseils liés à la mémorisation du Coran."
        ),
    },

    # ==============================
    # PRÉPARATION RAMADAN
    # ==============================

    {
        "slug": "nettoyer-son-coeur-avant-ramadan",
        "title": "Accueillir l'invité Royal",
        "subtitle": "Comment nettoyer son cœur avant le mois de Ramadan ?",
        "date": "2026-01-18",
        "speaker": None,
        "category": "Spiritualité & Ramadan",
        "summary": (
            "Une préparation spirituelle pour accueillir Ramadan "
            "avec un cœur purifié."
        ),
        "series_slug": "preparation-ramadan",
    },
    {
        "slug": "coran-taddabur-ramadan",
        "title": "Mon Coran et moi",
        "subtitle": "Pratiquer le Taddabur pour mieux le vivre pendant Ramadan",
        "date": "2026-01-25",
        "speaker": "Samaké Idriss",
        "category": "Spiritualité & Ramadan",
        "series_slug": "preparation-ramadan",
    },
    {
        "slug": "jeune-cinq-sens",
        "title": "Le jeûne des 5 sens",
        "subtitle": "Éduquer son ego au-delà de la faim et de la soif",
        "date": "2026-02-01",
        "speaker": "Haidara Vassindou",
        "category": "Spiritualité & Ramadan",
        "series_slug": "preparation-ramadan",
    },
    {
        "slug": "architecture-ramadan",
        "title": "Architecture du Ramadan",
        "subtitle": "Construire sa routine spirituelle idéale",
        "date": "2026-02-08",
        "speaker": "Bakayoko Allassane",
        "category": "Spiritualité & Ramadan",
        "series_slug": "preparation-ramadan",
    },
    {
        "slug": "reveiller-son-coeur-la-nuit",
        "title": "Avant Ramadan : réveille ton cœur la nuit",
        "date": "2026-02-15",
        "speaker": "Ouedraogo YoussoussF",
        "category": "Spiritualité & Ramadan",
        "series_slug": "preparation-ramadan",
    },

    {
        "slug": "tawhid-attestation-foi",
        "title": "Le Tawhid",
        "subtitle": "L'attestation de foi",
        "date": "2026-06-19",
        "speaker": "Ouedraogo Youssouf",
        "category": "Aqidah",
        "summary": (
            "Une réflexion autour du Tawhid "
            "et de la signification de l'attestation de foi."
        ),
    },
]


def seed():
    with app.app_context():

        print("Nettoyage des données existantes...")

        db.drop_all()
        db.create_all()

        created_series = {}

        print("Création des séries...")

        for data in series_data:

            serie = Series(
                slug=data["slug"],
                title=data["title"],
                subtitle=data.get("subtitle"),
                description=data.get("description"),
                category=data.get("category"),
            )

            db.session.add(serie)
            db.session.flush()

            created_series[
                serie.slug
            ] = serie

        print("Création des soirées...")

        for data in soirees_data:

            serie = None

            if data.get("series_slug"):
                serie = created_series.get(
                    data["series_slug"]
                )

            soiree = Soiree(
                slug=data["slug"],
                title=data["title"],
                subtitle=data.get("subtitle"),
                date=(
                    date.fromisoformat(data["date"])
                    if data.get("date")
                    else None
                ),
                speaker=data.get("speaker"),
                category=data.get("category"),
                summary=data.get("summary"),
                series=serie,
            )

            db.session.add(soiree)

        db.session.commit()

        print("===================================")
        print("Seed terminé avec succès !")
        print(f"Séries : {len(series_data)}")
        print(f"Soirées : {len(soirees_data)}")
        print("===================================")


if __name__ == "__main__":
    seed()