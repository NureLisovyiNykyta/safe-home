from app.config import Config
from flask import Flask
from flask_login import LoginManager
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS
import stripe
from flask_apscheduler import APScheduler
import firebase_admin
from firebase_admin import credentials
from flasgger import Swagger


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

    app.config['SWAGGER'] = {
        'title': 'Your API Documentation',
        'uiversion': 3,
        'specs_route': '/apidocs/',
    }
    swagger = Swagger(app)

    stripe.api_key = app.config["STRIPE_SECRET_KEY"]

    with app.app_context():
        db.create_all()

    from .routes import auth_bp, default_security_mode_bp, general_notification_bp, security_notification_bp
    from .routes import mobile_device_bp, home_bp, sensor_bp, subscription_bp, subscription_plan_bp,  user_bp
    from .routes import iot_bp, payments_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(default_security_mode_bp, url_prefix='/api')
    app.register_blueprint(general_notification_bp, url_prefix='/api')
    app.register_blueprint(security_notification_bp, url_prefix='/api')
    app.register_blueprint(sensor_bp, url_prefix='/api')
    app.register_blueprint(home_bp, url_prefix='/api')
    app.register_blueprint(mobile_device_bp, url_prefix='/api')
    app.register_blueprint(subscription_bp, url_prefix='/api')
    app.register_blueprint(subscription_plan_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(iot_bp, url_prefix='/iot')
    app.register_blueprint(payments_bp,  url_prefix='/payments')

    from app.utils.google_services_json_constructor import create_filled_service_account
    path_to_filled_json = create_filled_service_account('google-template.json')
    cred = credentials.Certificate(path_to_filled_json)
    firebase_admin.initialize_app(cred)

    from app.tasks import SubscriptionTask
    scheduler.add_job(
        id='check_subscription_ending',
        func=lambda: SubscriptionTask.check_subscription_expiration(app),
        trigger='interval',
        seconds=20,
        max_instances=1
    )
    scheduler.add_job(
        id='notify_subscription_ending',
        func=lambda: SubscriptionTask.notify_subscription_expiration(app),
        trigger='cron',
        hour=12,
        minute=0,
        max_instances=1
    )

    scheduler.start()

    return app
