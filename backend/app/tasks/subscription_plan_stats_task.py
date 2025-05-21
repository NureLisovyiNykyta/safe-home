from app.utils.error_handler import handle_errors, UnprocessableError
from app.repositories.subscription_plan_stats_repo import SubscriptionPlanStatsRepository
from app.repositories.role_repo import RoleRepository
from app.models.user import User
from app.models.subscription import Subscription
from app.models.home import Home
from app.models.sensor import Sensor
from app import db
from sqlalchemy.sql import func

class SubscriptionPlanStatsTask:
    @staticmethod
    @handle_errors
    def collect_subscription_plan_stats(app):
        with app.app_context():
            # Get "user" role
            role = RoleRepository.get_by_name("user")
            if not role:
                raise UnprocessableError("Role 'user' not found.")

            # Subquery for users with "user" role and active subscriptions
            user_subquery = (db.session.query(User.user_id)
                            .filter(User.role_id == role.role_id)
                            .subquery())

            # Get all subscription plans with active subscriptions
            active_subscriptions = (db.session.query(
                                        Subscription.plan_id,
                                        func.count(Subscription.user_id).label('user_count')
                                    )
                                    .join(user_subquery, Subscription.user_id == user_subquery.c.user_id)
                                    .filter(Subscription.is_active == True)
                                    .group_by(Subscription.plan_id)
                                    .subquery())

            # For each plan, calculate averages
            for plan in active_subscriptions:
                plan_id = plan.plan_id
                user_count = plan.user_count

                if user_count > 0:
                    # Average homes per user
                    avg_homes = (db.session.query(func.avg(func.count(Home.home_id)))
                                .join(Subscription, Home.user_id == Subscription.user_id)
                                .filter(Subscription.plan_id == plan_id,
                                        Subscription.is_active == True,
                                        Home.is_archived == False,
                                        Home.user_id.in_(user_subquery))
                                .group_by(Home.user_id)
                                .scalar()) or 0

                    # Average sensors per user (across all their homes)
                    avg_sensors = (db.session.query(func.avg(func.count(Sensor.sensor_id)))
                                  .join(Home, Sensor.home_id == Home.home_id)
                                  .join(Subscription, Home.user_id == Subscription.user_id)
                                  .filter(Subscription.plan_id == plan_id,
                                          Subscription.is_active == True,
                                          Home.is_archived == False,
                                          Sensor.is_archived == False,
                                          Home.user_id.in_(user_subquery))
                                  .group_by(Home.user_id)
                                  .scalar()) or 0

                    SubscriptionPlanStatsRepository.add_subscription_plan_stats(
                        plan_id=plan_id,
                        user_count=user_count,
                        avg_homes=avg_homes,
                        avg_sensors=avg_sensors
                    )
