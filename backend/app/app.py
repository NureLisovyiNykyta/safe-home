import logging
import firebase_admin
import stripe
from authlib.integrations.flask_client import OAuth
from firebase_admin import credentials
from flask import Flask
from flask_apscheduler import APScheduler
from flask_cors import CORS
from flask_login import LoginManager
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger
from flask_migrate import Migrate
from app.config import Config, setup_logging


db = SQLAlchemy()
login_manager = LoginManager()
oauth = OAuth()
mail = Mail()
scheduler = APScheduler()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    setup_logging(app)

    logger = logging.getLogger(__name__)
    logger.info("Initializing Flask application")

    CORS(app,
         methods=app.config['CORS_ALLOW_METHODS'],
         allow_headers=app.config['CORS_ALLOW_HEADERS'],
         max_age=app.config['CORS_MAX_AGE'])

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    oauth.init_app(app)
    mail.init_app(app)
    scheduler.init_app(app)

    app.config['SWAGGER'] = {
        'title': 'Your API Documentation',
        'uiversion': 3,
        'specs_route': '/apidocs/',
    }
    swagger = Swagger(app)

    stripe.api_key = app.config["STRIPE_SECRET_KEY"]

    # These imports register models in db.metadata for Flask-Migrate
    from .models import User, Role, SubscriptionPlan, DefaultSecurityMode, Sensor, Home, MobileDevice
    from .models import GeneralUserNotification, SecurityUserNotification, Subscription, AdminAuditLog

    from .db import init_seed_cli, seed_data
    init_seed_cli(app)

    if app.config['AUTO_DB_SETUP']:
        with app.app_context():
            from flask_migrate import upgrade
            upgrade()  # Apply migrations
            force = app.config['SEED_FORCE']
            seed_data(app, force=force)

    from .routes import init_routes
    init_routes(app)

    from app.utils.google_services_json_constructor import create_filled_service_account
    path_to_filled_json = create_filled_service_account('google-template.json')
    cred = credentials.Certificate(path_to_filled_json)
    firebase_admin.initialize_app(cred)

    from .tasks import init_tasks
    init_tasks(app, scheduler)
    scheduler.start()

    return app
