import firebase_admin
import stripe
from authlib.integrations.flask_client import OAuth
from firebase_admin import credentials
from flasgger import Swagger
from flask import Flask
from flask_apscheduler import APScheduler
from flask_cors import CORS
from flask_login import LoginManager
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from app.config import Config

db = SQLAlchemy()
login_manager = LoginManager()
oauth = OAuth()
mail = Mail()
scheduler = APScheduler()


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app,
         methods=app.config['CORS_ALLOW_METHODS'],
         allow_headers=app.config['CORS_ALLOW_HEADERS'],
         max_age=app.config['CORS_MAX_AGE'])

    db.init_app(app)
    login_manager.init_app(app)
    oauth.init_app(app)
    mail.init_app(app)
    scheduler.init_app(app)

    stripe.api_key = app.config["STRIPE_SECRET_KEY"]

    app.config['SWAGGER'] = {
        'title': 'Your API Documentation',
        'uiversion': 3,
        'specs_route': '/apidocs/',
    }
    swagger = Swagger(app)

    socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)
    from .sockets import init_sockets
    init_sockets(socketio)

    with app.app_context():
        db.create_all()

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
