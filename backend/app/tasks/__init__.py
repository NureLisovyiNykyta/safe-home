from .subscription_task import SubscriptionTask

def init_tasks(app, scheduler):
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
