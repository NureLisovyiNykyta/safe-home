from app.utils.error_handler import handle_errors, UnprocessableError
from app.repositories.user_stats_repo import UserStatsRepository
from app.repositories.role_repo import RoleRepository
from app.models.user import User
from app import db
from sqlalchemy.sql import func

class UserStatsTask:
    @staticmethod
    @handle_errors
    def collect_user_stats(app):
        with app.app_context():
            # Get "user" role
            role = RoleRepository.get_by_name("user")
            if not role:
                raise UnprocessableError("Role 'user' not found.")

            user_count = db.session.query(func.count(User.user_id)).filter(User.role_id == role.role_id).scalar()
            UserStatsRepository.add_user_stats(user_count=user_count)
