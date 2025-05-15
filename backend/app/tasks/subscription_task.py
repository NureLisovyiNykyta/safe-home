from datetime import datetime, timezone, timedelta
from app.services import HomeService, SubscriptionService
from app.utils.error_handler import handle_errors, UnprocessableError
from app.repositories import SubscriptionRepository, SubscriptionPlanRepository, HomeRepository
from app.services.notification import SubscriptionNotificationService, SubscriptionEmailService

class SubscriptionTask:
    @staticmethod
    @handle_errors
    def notify_subscription_expiration(app):
        with app.app_context():
            notification_days = [5, 3, 1]
            now = datetime.now(timezone.utc)

            subscriptions = SubscriptionRepository.get_active_subscriptions_ending_after(now)

            for subscription in subscriptions:
                days_left = (subscription.end_date - now).days

                if days_left in notification_days:
                    user = subscription.user

                    if user.email_confirmed:
                        SubscriptionEmailService.send_subscription_expiration_email(user, subscription)

                    SubscriptionNotificationService.send_subscription_expiration_notification(user, subscription, days_left)

    @staticmethod
    @handle_errors
    def check_subscription_expiration(app):
        with app.app_context():
            now = datetime.now(timezone.utc)
            subscriptions_ending = SubscriptionRepository.get_active_subscriptions_ending_before(now)

            basic_plan = SubscriptionPlanRepository.get_by_name("basic")
            if not basic_plan:
                raise UnprocessableError("Basic plan not found.")

            for subscription in subscriptions_ending:
                # Start a transaction for each subscription
                if subscription.plan_id == basic_plan.plan_id:
                    subscription.end_date = now + timedelta(days=subscription.plan.duration_days)
                    SubscriptionRepository.update(subscription)
                else:
                    # Cancel expired subscription
                    subscription.is_active = False
                    subscription.end_date = now
                    SubscriptionRepository.update(subscription)

                    # Create basic plan subscription
                    SubscriptionService.create_basic_subscription(user_id=subscription.user_id)

                    # Archive homes and sensors
                    user_homes = HomeRepository.get_all_by_user(subscription.user_id)
                    for home in user_homes:
                        if not home.is_archived:
                            HomeService.archive_home(home)

                    # Send notifications
                    user = subscription.user
                    if user.email_confirmed:
                        SubscriptionEmailService.send_subscription_canceled_email(user, subscription)

                    SubscriptionNotificationService.send_subscription_canceled_notification(user, subscription)
