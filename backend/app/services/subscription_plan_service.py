from app.utils.error_handler import handle_errors, UnprocessableError, ValidationError
from app.repositories.subscription_plan_repo import SubscriptionPlanRepository
from app.utils import Validator
from app.models.subscription_plan import SubscriptionPlan
from flask import jsonify

class SubscriptionPlanService:
    @staticmethod
    @handle_errors
    def get_all_subscription_plans():
        plans = SubscriptionPlanRepository.get_all()
        subscription_plans_list = [
            {
                "plan_id": str(plan.plan_id),
                "name": plan.name,
                "max_homes": plan.max_homes,
                "max_sensors": plan.max_sensors,
                "price": plan.price,
                "duration": plan.duration_days,
            } for plan in plans
        ]
        return jsonify({"subscription_plans": subscription_plans_list}), 200

    @staticmethod
    @handle_errors
    def create_subscription_plan(body):
        Validator.validate_required_fields(body, ['name', 'max_homes', 'max_sensors', 'price', 'duration_days'])

        Validator.validate_positive_integer(body['max_homes'], 'max_homes')
        Validator.validate_positive_integer(body['max_sensors'], 'max_sensors')
        Validator.validate_positive_integer(body['duration_days'], 'duration_days')
        Validator.validate_positive_number(body['price'], 'price')

        new_plan = SubscriptionPlan(
            name=body['name'],
            max_homes=body['max_homes'],
            max_sensors=body['max_sensors'],
            price=body['price'],
            duration_days=body['duration_days']
        )
        SubscriptionPlanRepository.add(new_plan)
        return jsonify({"message": "Subscription plan created successfully."}), 201

    @staticmethod
    @handle_errors
    def update_subscription_plan(plan_id, body):
        plan = SubscriptionPlanRepository.get_by_id(plan_id)
        if not plan:
            raise UnprocessableError("Subscription plan not found.")

        updatable_fields = ["name", "max_homes", "max_sensors", "price", "duration_days"]
        for field in updatable_fields:
            value = body.get(field)
            if value is not None and value != "":
                if field in ["max_homes", "max_sensors", "duration_days"]:
                    Validator.validate_positive_integer(value, field)
                if field == "price":
                    Validator.validate_positive_number(value, field)
                setattr(plan, field, value)

        SubscriptionPlanRepository.update(plan)
        return jsonify({"message": "Subscription plan updated successfully."}), 200
