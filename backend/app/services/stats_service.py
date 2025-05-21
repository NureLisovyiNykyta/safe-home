from flask import jsonify
from app.utils.error_handler import handle_errors, UnprocessableError
from app.utils import Validator
from app.repositories.user_stats_repo import UserStatsRepository
from app.repositories.subscription_plan_stats_repo import SubscriptionPlanStatsRepository
from app.repositories.subscription_plan_repo import SubscriptionPlanRepository

class StatsService:
    @staticmethod
    @handle_errors
    def get_user_stats(days: int):
        Validator.validate_positive_integer(days, "days")
        stats = UserStatsRepository.get_user_stats_by_days(days)
        user_stats = [
            {
                'stats_id': str(stat.stats_id),
                'date': stat.stats_date.isoformat(),
                'user_count': stat.user_count
            } for stat in stats
        ]
        return jsonify({"user_stats": user_stats}), 200

    @staticmethod
    @handle_errors
    def get_subscription_plan_stats(days: int, plan_id: str = None):
        Validator.validate_positive_integer(days, "days")

        plan = SubscriptionPlanRepository.get_by_id(plan_id)
        if not plan:
            raise UnprocessableError("Subscription plan not found.")

        stats = SubscriptionPlanStatsRepository.get_subscription_plan_stats_by_days(days, plan_id)
        subscription_plan_stats = [
            {
                'stats_id': str(stat.stats_id),
                'date': stat.stats_date.isoformat(),
                'plan_id': str(stat.plan_id),
                'plan_name': stat.plan.name,
                'user_count': stat.user_count,
                'avg_homes': stat.avg_homes,
                'avg_sensors': stat.avg_sensors
            } for stat in stats
        ]
        return jsonify({"subscription_plan_stats": subscription_plan_stats}), 200
