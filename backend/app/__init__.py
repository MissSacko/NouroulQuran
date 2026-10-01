from flask import Flask

from .config import Config
from .extensions import db, migrate, cors


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["FRONTEND_ORIGIN"]
            }
        },
    )

    from . import models

    from .routes.public import public_bp
    from .routes.admin import admin_bp

    app.register_blueprint(
        public_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        admin_bp,
        url_prefix="/api/admin"
    )

    @app.get("/api/health")
    def health():
        return {
            "status": "ok",
            "message": "Nouroul Qur'an API is running"
        }

    return app