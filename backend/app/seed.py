from app import db
from app.models.role import Role
from app.models.subscription_plan import SubscriptionPlan
from app.models.default_security_mode import DefaultSecurityMode
from app.models.user import User
from app.repositories.role_repo import RoleRepository
from app.utils.error_handler import handle_errors
import os
from dotenv import load_dotenv

load_dotenv()

@handle_errors
def seed_data(app):
    with app.app_context():
        # Table completion role
        if not Role.query.first():
            roles = [
                Role(role_name='user', description=None),
                Role(role_name='admin', description=None)
            ]
            db.session.bulk_save_objects(roles)
            db.session.commit()
            print("Roles added.")

        # Table completion subscription_plan
        if not SubscriptionPlan.query.first():
            plans = [
                SubscriptionPlan(name='premium', max_homes=5, max_sensors=20, price=10.0, duration_days=30),
                SubscriptionPlan(name='basic', max_homes=1, max_sensors=4, price=0.0, duration_days=365)
            ]
            db.session.bulk_save_objects(plans)
            db.session.commit()
            print("Subscription plans added.")

        # Table completion default_security_mode
        if not DefaultSecurityMode.query.first():
            modes = [
                DefaultSecurityMode(mode_name='armed', description='all sensors are active', is_selectable=True),
                DefaultSecurityMode(mode_name='disarmed', description='all sensors are disabled', is_selectable=True),
                DefaultSecurityMode(mode_name='custom', description='user changed default security mode', is_selectable=False),
                DefaultSecurityMode(mode_name='alert', description='security breach detected', is_selectable=False)
            ]
            db.session.bulk_save_objects(modes)
            db.session.commit()
            print("Security modes added.")

        # Table completion user
        if not User.query.first():
            admin_role = RoleRepository.get_by_name('admin')
            if admin_role:
                admin_user = User(
                    name=os.getenv('ADMIN_NAME'),
                    email=os.getenv('ADMIN_EMAIL'),
                    email_confirmed=True,
                    role_id=admin_role.role_id
                )
                admin_user.set_password(os.getenv('ADMIN_PASSWORD'))
                db.session.add(admin_user)
                db.session.commit()
                print("Admin user added.")
