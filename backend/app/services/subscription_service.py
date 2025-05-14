from app.utils.error_handler import handle_errors, UnprocessableError, ValidationError
from app.repositories.subscription_repo import SubscriptionRepository
from app.repositories.user_repo import UserRepository
from app.repositories.subscription_plan_repo import SubscriptionPlanRepository
from app.models.subscription import Subscription
from flask import jsonify
from datetime import datetime, timezone, timedelta

class SubscriptionService:
    @staticmethod
    def get_current_subscription(user_id):
        current_subscription = SubscriptionRepository.get_active_by_user(user_id)
        if not current_subscription:
            raise UnprocessableError("No active subscription found for the user.")
        return current_subscription

    @staticmethod
    @handle_errors
    def get_current_subscription_info(user_id):
        current_subscription = SubscriptionRepository.get_active_by_user(user_id)
        if not current_subscription:
            raise UnprocessableError("No active subscription found for the user.")

        subscription_info = {
            "subscription_id": str(current_subscription.subscription_id),
            "user_id": str(current_subscription.user_id),
            "plan": {
                "plan_id": str(current_subscription.plan.plan_id),
                "name": current_subscription.plan.name,
                "price": current_subscription.plan.price,
                "duration_days": current_subscription.plan.duration_days,
            },
            "start_date": current_subscription.start_date.isoformat(),
            "end_date": current_subscription.end_date.isoformat() if current_subscription.end_date else None,
            "is_active": current_subscription.is_active,
        }
        return jsonify(subscription_info), 200

    @staticmethod
    @handle_errors
    def get_user_subscriptions(user_id):
        subscriptions = SubscriptionRepository.get_all_by_user(user_id)
        if not subscriptions:
            raise UnprocessableError("No subscriptions found for the user.")

        subscriptions_list = [
            {
                "subscription_id": str(subscription.subscription_id),
                "user_id": str(subscription.user_id),
                "plan": {
                    "plan_id": str(subscription.plan.plan_id),
                    "name": subscription.plan.name,
                    "price": subscription.plan.price,
                    "duration_days": subscription.plan.duration_days,
                },
                "start_date": subscription.start_date.isoformat(),
                "end_date": subscription.end_date.isoformat() if subscription.end_date else None,
                "is_active": subscription.is_active,
            } for subscription in subscriptions
        ]
        return jsonify({"subscriptions": subscriptions_list}), 200

    @staticmethod
    @handle_errors
    def cancel_current_subscription(user_id):
        current_subscription = SubscriptionRepository.get_active_by_user(user_id)
        if not current_subscription:
            raise UnprocessableError("No active subscription found for the user.")

        if current_subscription.plan.name == 'basic':
            raise UnprocessableError("Cannot cancel a basic subscription.")

        current_subscription.is_active = False
        current_subscription.end_date = datetime.now(timezone.utc)
        SubscriptionRepository.update(current_subscription)

        SubscriptionService.create_basic_subscription(user_id)
        return jsonify({"message": "Subscription cancelled successfully."}), 200

    @staticmethod
    @handle_errors
    def purchase_paid_subscription(user_id, body):
        plan_id = body.get('plan_id')
        if not plan_id:
            raise ValidationError("Plan ID is required.")

        plan = SubscriptionPlanRepository.get_by_id(plan_id)
        if not plan:
            raise UnprocessableError("Subscription plan not found.")

        if plan.name == 'basic':
            raise UnprocessableError("Cannot purchase a basic plan as a paid subscription.")

        existing_subscription = SubscriptionRepository.get_active_by_user(user_id)
        if existing_subscription:
            existing_subscription.is_active = False
            existing_subscription.end_date = datetime.now(timezone.utc)
            SubscriptionRepository.update(existing_subscription)

        new_subscription = Subscription(
            user_id=user_id,
            plan_id=plan_id,
            end_date=datetime.now(timezone.utc) + timedelta(days=plan.duration_days),
            is_active=True
        )
        user = UserRepository.get_by_id(user_id)
        user.subscription_plan_name = plan.name

        SubscriptionRepository.add(new_subscription)
        return jsonify({"message": "Payment successful. Paid subscription created."}), 201

    @staticmethod
    @handle_errors
    def extend_subscription(user_id):
        active_subscription = SubscriptionRepository.get_active_by_user(user_id)
        if not active_subscription:
            raise UnprocessableError("User does not have an active subscription.")

        active_subscription.end_date += timedelta(days=active_subscription.plan.duration_days)
        SubscriptionRepository.update(active_subscription)
        return jsonify({"message": "Payment successful. Subscription extended."}), 200

    @staticmethod
    @handle_errors
    def create_basic_subscription(user_id):
        existing_subscription = SubscriptionRepository.get_active_by_user(user_id)
        if existing_subscription:
            raise UnprocessableError("User already has an active subscription.")

        plan = SubscriptionPlanRepository.get_by_name('basic')
        if not plan:
            raise UnprocessableError("Subscription plan 'basic' not found.")

        new_subscription = Subscription(
            user_id=user_id,
            plan_id=plan.plan_id,
            end_date=datetime.now(timezone.utc) + timedelta(days=plan.duration_days),
            is_active=True
        )
        user = UserRepository.get_by_id(user_id)
        user.subscription_plan_name = plan.name

        SubscriptionRepository.add(new_subscription)
