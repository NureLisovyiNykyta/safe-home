from app.services.email_confirm_service import EmailConfirmService
from app.services import auth_service
from app.services import google_auth_service, firebase_auth_service
from flask import Blueprint, request
from flask_login import login_required

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return auth_service.register_user(data)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return auth_service.session_login_user(data)


@auth_bp.route('/auth/google')
def google_login():
    return google_auth_service.initiate_google_login()


@auth_bp.route('/auth/google/callback')
def google_callback():
    return google_auth_service.handle_google_callback()


@auth_bp.route('/firebase_auth', methods=['POST'])
def firebase_auth():
    data = request.get_json()
    return firebase_auth_service.firebase_auth(data)


@auth_bp.route('/confirm_email/<token>', methods=['GET'])
def confirm_email(token):
    return EmailConfirmService.verify_email_token(token)


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    return auth_service.logout_user()


@auth_bp.route('/token_login', methods=['POST'])
def token_login():
    data = request.get_json()
    return auth_service.token_login_user(data)
