from flask import Blueprint, request
from app.services import password_reset_service
from app.models import User
from app.utils.auth_decorator import auth_required

user_profile_bp = Blueprint('user_profile', __name__)


@user_profile_bp.route('/profile', methods=['GET'])
@auth_required
def get_profile():
    user = request.current_user
    return User.get_user(user.user_id)


@user_profile_bp.route('/update_profile', methods=['PUT'])
@auth_required
def update_profile():
    user = request.current_user
    data = request.get_json()
    return User.update_user_profile(user.user_id, data)


@user_profile_bp.route('/update_password', methods=['PUT'])
@auth_required
def update_password():
    user = request.current_user
    data = request.get_json()
    return User.update_user_password(user.user_id, data)


@user_profile_bp.route('/reset_password', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    return password_reset_service.reset_password_request(data)

@user_profile_bp.route('/confirm_reset_password/<token>', methods=['GET'])
def confirm_reset_password(token):
    return password_reset_service.verify_reset_password_token(token)
