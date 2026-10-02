from datetime import date, time

from app import create_app
from app.extensions import db
from app.models import (
    User,
    Series,
    Soiree,
    Surah,
    Tafsir,
    Event,
)


app = create_app()


# ============================================================
# DONNÉES
# ============================================================

SERIES = [
    {
        "slug": "sur-les-traces-des-sahabas",
        "title": "Sur les traces des Sahabas",
        "subtitle": "À la découverte des grandes figures de l'Islam",
        "description": (
            "Une série de rencontres consacrée à la découverte de la vie, "
            "de la foi, du caractère et des enseignements des Sahabas "
            "et des grandes figures de l'Islam."
        ),
        "category": "Sahabas & grandes figures",
    },
    {
        "slug": "preparation-ramadan",
        "title": "Préparons le Ramadan",
        "subtitle": "Préparer son cœur et son âme à accueillir Ramadan",
        "description": (
            "Une série de rencontres pour se préparer spirituellement "
            "au mois de Ramadan, purifier son cœur, renforcer sa relation "
            "avec le Coran et construire une routine spirituelle durable."
        ),
        "category": "Spiritualité & Ramadan",
    },
]


SOIREES = [
    {
        "number": 1,
        "slug": "lire-comprendre-vivre-coran",
        "title": "Lire, comprendre et vivre le Coran",
        "subtitle": "Trois niveaux d'interaction",
        "date": date(2025, 10, 31),
        "speaker": "Imam Mohamed Loukou",
        "category": "Coran & compréhension",
        "summary": (
            "Une réflexion sur les trois niveaux d'interaction avec le Coran : "
            "le lire, le comprendre et le mettre en pratique."
        ),
        "series_slug": "ordinaire",
    },
    {
        "number": 2,
        "slug": "sincerite-memorisation",
        "title": "La sincérité dans la mémorisation",
        "subtitle": "Ne pas apprendre pour impressionner",
        "date": date(2025, 11, 7),
        "speaker": "Haidara Vassindou",
        "category": "Mémorisation",
        "summary": (
            "Une réflexion sur l'intention et la sincérité dans "
            "l'apprentissage et la mémorisation du Coran."
        ),
        "series_slug": "ordinaire",
    },
    {
        "number": 3,
        "slug": "coran-relations",
        "title": "Vivre le Coran dans nos relations",
        "subtitle": "Douceur, justice et bienveillance",
        "date": date(2025, 11, 14),
        "speaker": "Barry Bashir",
        "category": "Coran & vie quotidienne",
        "summary": (
            "Comment les enseignements du Coran peuvent-ils transformer "
            "notre manière de nous comporter avec les autres ?"
        ),
        "series_slug": "ordinaire",
    },
    {
        "number": 4,
        "slug": "revelation-coran",
        "title": "La révélation",
        "subtitle": "Comment le Coran est descendu sur le Prophète ﷺ",
        "date": date(2025, 11, 21),
        "speaker": "Doumbia Bilal",
        "category": "Coran",
        "summary": (
            "Une découverte du processus de révélation du Coran "
            "au Prophète Muhammad ﷺ."
        ),
        "series_slug": "ordinaire",
    },
    {
        "number": 5,
        "slug": "coran-sunna",
        "title": "Le Coran et la Sunna",
        "subtitle": "Comment ils se complètent dans notre vie",
        "date": date(2025, 11, 28),
        "speaker": "Imam Mohamed Loukou",
        "category": "Coran & Sunna",
        "summary": (
            "Comprendre la complémentarité entre le Coran et la Sunna "
            "dans la pratique de notre religion."
        ),
        "series_slug": "ordinaire",
    },
    {
        "number": 6,
        "slug": "experiences-memorisation-coran",
        "title": "Partage d'expériences sur la mémorisation du Coran",
        "subtitle": None,
        "date": date(2025, 12, 14),
        "speaker": "Ibrahim Nouh",
        "category": "Mémorisation",
        "summary": (
            "Un moment de partage autour des expériences, difficultés "
            "et conseils liés à la mémorisation du Coran."
        ),
        "series_slug": "ordinaire",
    },

    # -------------------------
    # PRÉPARATION RAMADAN
    # -------------------------

    {
        "number": 7,
        "slug": "nettoyer-son-coeur-avant-ramadan",
        "title": "Accueillir l'invité Royal",
        "subtitle": "Comment nettoyer son cœur avant le mois de Ramadan ?",
        "date": date(2026, 1, 18),
        "speaker": None,
        "category": "Préparation Ramadan",
        "summary": (
            "Une préparation spirituelle pour accueillir Ramadan "
            "avec un cœur purifié et disposé à recevoir les bienfaits "
            "du mois béni."
        ),
        "series_slug": "preparation-ramadan",
    },
    {
        "number": 8,
        "slug": "coran-taddabur-ramadan",
        "title": "Mon Coran et moi",
        "subtitle": "Pratiquer le Taddabur pour mieux le vivre pendant Ramadan",
        "date": date(2026, 1, 25),
        "speaker": "Samaké Idriss",
        "category": "Préparation Ramadan",
        "summary": (
            "Apprendre à méditer sur les versets du Coran afin "
            "de développer une relation plus profonde avec le Livre d'Allah."
        ),
        "series_slug": "preparation-ramadan",
    },
    {
        "number": 9,
        "slug": "jeune-cinq-sens",
        "title": "Le jeûne des 5 sens",
        "subtitle": "Éduquer son ego au-delà de la faim et de la soif",
        "date": date(2026, 2, 1),
        "speaker": "Haidara Vassindou",
        "category": "Préparation Ramadan",
        "summary": (
            "Le véritable jeûne ne se limite pas à s'abstenir "
            "de nourriture et de boisson : il concerne également "
            "nos sens et nos comportements."
        ),
        "series_slug": "preparation-ramadan",
    },
    {
        "number": 10,
        "slug": "architecture-ramadan",
        "title": "Architecture du Ramadan",
        "subtitle": "Construire sa routine spirituelle idéale",
        "date": date(2026, 2, 8),
        "speaker": "Bakayoko Allassane",
        "category": "Préparation Ramadan",
        "summary": (
            "Construire une organisation spirituelle équilibrée "
            "pour profiter pleinement du mois de Ramadan."
        ),
        "series_slug": "preparation-ramadan",
    },
    {
        "number": 11,
        "slug": "reveiller-son-coeur-la-nuit",
        "title": "Avant Ramadan : réveille ton cœur la nuit",
        "subtitle": None,
        "date": date(2026, 2, 15),
        "speaker": "Ouedraogo Youssouf",
        "category": "Préparation Ramadan",
        "summary": (
            "Une invitation à renouer avec la prière nocturne "
            "et à préparer son cœur aux adorations de Ramadan."
        ),
        "series_slug": "preparation-ramadan",
    },

    # -------------------------
    # AUTRES SOIRÉES
    # -------------------------

    {
        "number": 12,
        "slug": "tawhid-attestation-foi",
        "title": "Le Tawhid",
        "subtitle": "L'attestation de foi",
        "date": date(2026, 6, 19),
        "speaker": "Ouedraogo Youssouf",
        "category": "Aqidah",
        "summary": (
            "Une réflexion autour du Tawhid et de la signification "
            "profonde de l'attestation de foi."
        ),
        "series_slug": "ordinaire",
    },
    {
        "number": 13,
        "slug": "arafat-rendez-vous-croyants",
        "title": "Arafat",
        "subtitle": "Le rendez-vous des croyants avec la miséricorde d'Allah",
        "date": date(2026, 5, 24),
        "speaker": "Oustaz Sana Abdoul Bassit",
        "category": "Spiritualité",
        "summary": (
            "Une réflexion autour du jour de Arafat, de ses mérites "
            "et de la miséricorde d'Allah."
        ),
        "series_slug": "ordinaire",
    },

    # -------------------------
    # SUR LES TRACES DES SAHABAS
    # -------------------------

    {
        "number": 14,
        "slug": "musab-ibn-umayr",
        "title": "Mus'ab Ibn Umayr",
        "subtitle": "Quand sacrifier le confort devient une victoire",
        "date": None,
        "speaker": None,
        "category": "Sahabas",
        "summary": (
            "À la découverte du parcours de Mus'ab Ibn Umayr, "
            "compagnon dont la vie illustre le sacrifice et le dévouement pour Allah."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 15,
        "slug": "abu-bakr-as-siddiq",
        "title": "Abou Bakr As-Siddiq",
        "subtitle": "Une confiance absolue en Allah et en Son Messager ﷺ",
        "date": None,
        "speaker": None,
        "category": "Sahabas",
        "summary": (
            "Découvrir la foi, la loyauté et la confiance exceptionnelle "
            "d'Abou Bakr As-Siddiq."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 16,
        "slug": "omar-ibn-al-khattab",
        "title": "Oumar Ibn Al-Khattab",
        "subtitle": "Entre puissance, humilité et justice",
        "date": None,
        "speaker": None,
        "category": "Sahabas",
        "summary": (
            "Une découverte de la personnalité d'Oumar Ibn Al-Khattab "
            "et de son modèle de justice."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 17,
        "slug": "ousmane-ibn-affan",
        "title": "Ousmane Ibn Affan",
        "subtitle": "Quand la générosité rencontre la pudeur",
        "date": None,
        "speaker": None,
        "category": "Sahabas",
        "summary": (
            "Découvrir la pudeur, la générosité et les qualités "
            "spirituelles d'Ousmane Ibn Affan."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 18,
        "slug": "ali-ibn-abi-talib",
        "title": "Ali Ibn Abi Talib",
        "subtitle": "Un modèle de sagesse, de courage et de justice",
        "date": None,
        "speaker": None,
        "category": "Sahabas",
        "summary": (
            "Une découverte de la sagesse, du courage et de la justice "
            "d'Ali Ibn Abi Talib."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 19,
        "slug": "assia-bint-muzahim",
        "title": "Assia Bint Muzahim",
        "subtitle": "Un exemple de patience, de courage et de confiance en Allah",
        "date": None,
        "speaker": None,
        "category": "Grandes figures",
        "summary": (
            "Le parcours d'Assia Bint Muzahim, figure exemplaire "
            "de patience et de confiance en Allah."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 20,
        "slug": "maryam-bint-imran",
        "title": "Maryam Bint Imran",
        "subtitle": "Femme de vœu, de sincérité et de confiance absolue en Allah",
        "date": None,
        "speaker": None,
        "category": "Grandes figures",
        "summary": (
            "Découvrir la vie et les qualités spirituelles de Maryam Bint Imran."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 21,
        "slug": "khadijah",
        "title": "Khadijah",
        "subtitle": (
            "La première des croyantes : puiser sa force spirituelle dans son héritage"
        ),
        "date": None,
        "speaker": None,
        "category": "Grandes figures",
        "summary": (
            "Une découverte de Khadijah رضي الله عنها, de sa foi, "
            "de son soutien et de son héritage spirituel."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
    {
        "number": 22,
        "slug": "fatima-az-zahra",
        "title": "Fatima Az-Zahra",
        "subtitle": (
            "Grandir dans l'ombre du Prophète ﷺ entre foi, pudeur et résilience"
        ),
        "date": None,
        "speaker": None,
        "category": "Grandes figures",
        "summary": (
            "Une découverte de la vie de Fatima Az-Zahra et des valeurs "
            "de foi, pudeur et résilience qu'elle incarne."
        ),
        "series_slug": "sur-les-traces-des-sahabas",
    },
]


# ============================================================
# SOURATES UTILISÉES PAR LES TAFSIRS
# ============================================================

SURAHS = [
    {
        "number": 1,
        "name": "Al-Fatiha",
        "verse_count": 7,
    },
    {
        "number": 110,
        "name": "An-Nasr",
        "verse_count": 3,
    },
    {
        "number": 111,
        "name": "Al-Masad",
        "verse_count": 5,
    },
    {
        "number": 112,
        "name": "Al-Ikhlas",
        "verse_count": 4,
    },
    {
        "number": 113,
        "name": "Al-Falaq",
        "verse_count": 5,
    },
    {
        "number": 114,
        "name": "An-Nas",
        "verse_count": 6,
    },
]


# ============================================================
# TAFSIRS
# ============================================================

TAFSIRS = [
    {
        "slug": "tafsir-al-fatiha-angre-djibi",
        "date": date(2025, 5, 31),
        "intervenant": "Imam Idriss Samaké",
        "organisateur": "Samira Kouamé",
        "lieu": "Angré Djibi",
        "mosquee": "Al Firad",
        "surah_number": 1,
        "description": "Séance de Tafsir consacrée à la sourate Al-Fatiha.",
    },
    {
        "slug": "tafsir-al-fatiha-bingerville",
        "date": date(2025, 7, 5),
        "intervenant": "Imam Idriss Samaké",
        "organisateur": None,
        "lieu": "Bingerville",
        "mosquee": "Oumar Ibn Khattab",
        "surah_number": 1,
        "description": "Séance de Tafsir consacrée à la sourate Al-Fatiha.",
    },
    {
        "slug": "tafsir-an-nas-koumassi",
        "date": date(2025, 8, 30),
        "intervenant": "Imam Ballo Mohammed",
        "organisateur": None,
        "lieu": "Koumassi Remblais",
        "mosquee": "Tour Sinine",
        "surah_number": 114,
        "description": "Séance de Tafsir consacrée à la sourate An-Nas.",
    },
    {
        "slug": "tafsir-an-nas-williamsville",
        "date": date(2025, 11, 2),
        "intervenant": "Imam Sangaré Ibrahim",
        "organisateur": None,
        "lieu": "Williamsville",
        "mosquee": "Abdoul Karim Sogodogo",
        "surah_number": 114,
        "description": "Séance de Tafsir consacrée à la sourate An-Nas.",
    },
    {
        "slug": "tafsir-al-falaq-abobo-dokui",
        "date": date(2025, 12, 6),
        "intervenant": "Hassan Zampaligré",
        "organisateur": None,
        "lieu": "Abobo Dokui",
        "mosquee": "Walidaïne",
        "surah_number": 113,
        "description": "Séance de Tafsir consacrée à la sourate Al-Falaq.",
    },
    {
        "slug": "tafsir-al-falaq-habloullah",
        "date": date(2026, 1, 17),
        "intervenant": "Hassan Zampaligré",
        "organisateur": None,
        "lieu": "Abobo Dokui",
        "mosquee": "Habloullah El Matine",
        "surah_number": 113,
        "description": "Séance de Tafsir consacrée à la sourate Al-Falaq.",
    },
    {
        "slug": "tafsir-abobo-samake",
        "date": date(2026, 2, 22),
        "intervenant": None,
        "organisateur": None,
        "lieu": "Abobo Samaké",
        "mosquee": "El Hadj Seydou Toloba",
        "surah_number": None,
        "description": "Séance de Tafsir.",
    },
    {
        "slug": "tafsir-yopougon-salam",
        "date": date(2026, 3, 8),
        "intervenant": "Imam Bakayoko Allassane",
        "organisateur": None,
        "lieu": "Yopougon Zone Industrielle",
        "mosquee": "Salam",
        "surah_number": None,
        "description": "Séance de Tafsir.",
    },
    {
        "slug": "tafsir-al-ikhlas-williamsville",
        "date": date(2026, 4, 26),
        "intervenant": "Imam Adam Bamba",
        "organisateur": None,
        "lieu": "Adjamé Williamsville",
        "mosquee": "Hadja Néné Djamilatou",
        "surah_number": 112,
        "description": "Séance de Tafsir consacrée à la sourate Al-Ikhlas.",
    },
    {
        "slug": "tafsir-al-masad-abobo",
        "date": date(2026, 6, 27),
        "intervenant": "Imam Fofana Inza",
        "organisateur": None,
        "lieu": "Abobo Camp Commando",
        "mosquee": "Tao",
        "surah_number": 111,
        "description": "Séance de Tafsir consacrée à la sourate Al-Masad.",
    },
    {
        "slug": "tafsir-an-nasr-williamsville",
        "date": date(2026, 8, 30),
        "intervenant": "Imam Diarrasouba Alassane",
        "organisateur": None,
        "lieu": "Adjamé Williamsville",
        "mosquee": "Hadja Néné Djamilatou",
        "surah_number": 110,
        "description": "Séance de Tafsir consacrée à la sourate An-Nasr.",
    },
]


# ============================================================
# ÉVÉNEMENTS
# ============================================================

EVENTS = [
    {
        "slug": "ceremonie-lancement",
        "title": "Cérémonie de lancement de Nouroul Qur'An",
        "description": (
            "Grande cérémonie de lancement de la Communauté Nouroul Qur'An. "
            "Au programme : conférence, présentation des activités du club, "
            "tafsir, psalmodie du Coran et jeux concours."
        ),
        "date": date(2026, 12, 19),
        "start_time": time(8, 0),
        "end_time": time(17, 0),
        "location": "Mosquée Firad — Angré, pharmacie Les Arcades",
        "registration_enabled": True,
        "registration_url": None,
        "countdown_enabled": True,
        "is_published": True,
    },
]


# ============================================================
# SEED
# ============================================================

with app.app_context():

    print("🧹 Nettoyage de la base...")

    db.drop_all()
    db.create_all()

    print("🌱 Création des utilisateurs...")

    admin = User(
        name="Administrateur Nouroul Qur'An",
        email="admin@nouroulquran.org",
        role="admin",
        is_active=True,
    )
    admin.set_password("ChangeMe123!")

    db.session.add(admin)

    # --------------------------------------------------------
    # SERIES
    # --------------------------------------------------------

    print("📚 Création des séries...")

    series_map = {}

    for item in SERIES:
        serie = Series(
            slug=item["slug"],
            title=item["title"],
            subtitle=item["subtitle"],
            description=item["description"],
            category=item["category"],
            cover_image=None,
            is_published=True,
        )

        db.session.add(serie)
        series_map[item["slug"]] = serie

    db.session.flush()

    # --------------------------------------------------------
    # SOIRÉES
    # --------------------------------------------------------

    print("🌙 Création des soirées...")

    for item in SOIREES:

        serie = None

        if item["series_slug"]:
            serie = series_map[item["series_slug"]]

        soiree = Soiree(
            number=item["number"],
            slug=item["slug"],
            title=item["title"],
            subtitle=item["subtitle"],
            date=item["date"],
            speaker=item["speaker"],
            category=item["category"],
            summary=item["summary"],
            description=None,
            cover_image=None,
            series=serie,
            is_published=True,
        )

        db.session.add(soiree)

    # --------------------------------------------------------
    # SOURATES
    # --------------------------------------------------------

    print("📖 Création des sourates...")

    surah_map = {}

    for item in SURAHS:

        surah = Surah(
            number=item["number"],
            name=item["name"],
            verse_count=item["verse_count"],
            revelation_order=None,
            revelation_type=None,
            appellation_reason=None,
        )

        db.session.add(surah)
        surah_map[item["number"]] = surah

    db.session.flush()

    # --------------------------------------------------------
    # TAFSIRS
    # --------------------------------------------------------

    print("📚 Création des Tafsirs...")

    for item in TAFSIRS:

        surah = None

        if item["surah_number"]:
            surah = surah_map[item["surah_number"]]

        tafsir = Tafsir(
            slug=item["slug"],
            date=item["date"],
            intervenant=item["intervenant"],
            organisateur=item["organisateur"],
            lieu=item["lieu"],
            mosquee=item["mosquee"],
            description=item["description"],
            contexte_revelation=None,
            themes_principaux=[],
            termes_cles=[],
            explication=None,
            lecons_pratiques=[],
            cover_image=None,
            surah=surah,
            is_published=True,
        )

        db.session.add(tafsir)

    # --------------------------------------------------------
    # EVENTS
    # --------------------------------------------------------

    print("📅 Création des événements...")

    for item in EVENTS:

        event = Event(
            slug=item["slug"],
            title=item["title"],
            description=item["description"],
            date=item["date"],
            start_time=item["start_time"],
            end_time=item["end_time"],
            location=item["location"],
            cover_image=None,
            registration_enabled=item["registration_enabled"],
            registration_url=item["registration_url"],
            countdown_enabled=item["countdown_enabled"],
            is_published=item["is_published"],
        )

        db.session.add(event)

    # --------------------------------------------------------
    # COMMIT
    # --------------------------------------------------------

    db.session.commit()

    print()
    print("✅ SEED TERMINÉ AVEC SUCCÈS !")
    print("--------------------------------")
    print(f"👤 Utilisateurs : {User.query.count()}")
    print(f"📚 Séries       : {Series.query.count()}")
    print(f"🌙 Soirées      : {Soiree.query.count()}")
    print(f"📖 Sourates     : {Surah.query.count()}")
    print(f"📜 Tafsirs      : {Tafsir.query.count()}")
    print(f"📅 Événements   : {Event.query.count()}")
    print("--------------------------------")
    print("🔐 Admin : admin@nouroulquran.org")
    print("⚠️ Mot de passe temporaire : ChangeMe123!")