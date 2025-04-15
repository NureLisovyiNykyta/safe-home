from flask import Blueprint, request
from app.models import SecurityUserNotification, GeneralUserNotification
from app.utils.auth_decorator import role_required

notification_bp = Blueprint('notification', __name__)


@notification_bp.route('/general_notifications/limit', methods=['Get'])
@role_required(['user']) 
def get_general_notifications():
    user = request.current_user
    limit = request.args.get('limit')
    return GeneralUserNotification.get_notifications_by_user(user.user_id, limit)


@notification_bp.route('/security_notifications/limit', methods=['Get'])
@role_required(['user']) 
def get_security_notifications():
    user = request.current_user
    limit = request.args.get('limit')
    return SecurityUserNotification.get_notifications_by_user(user.user_id, limit)


@notification_bp.route('/security_notifications_by_home/home/limit', methods=['Get'])
@role_required(['user']) 
def get_security_notifications_by_home():
    home_id = request.args.get('home')
    limit = request.args.get('limit')
    return SecurityUserNotification.get_notifications_by_home(home_id, limit)
