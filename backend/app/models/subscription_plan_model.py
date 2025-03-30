from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import jsonify
from app.utils import ErrorHandler


class SubscriptionPlan(db.Model):
    __tablename__ = 'subscription_plan'

    plan_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    max_homes = db.Column(db.Integer, nullable=False)
    max_sensors = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration_days = db.Column(db.Integer, nullable=False)

    subscriptions = db.relationship('Subscription', back_populates='plan')

    @classmethod
    def get_all_subscription_plans(cls):
        try:
            subscription_plans = cls.query.filter_by().all()
            subscription_plans_list = [
                {
                    "plan_id": str(plan.plan_id),
                    "name": plan.name,
                    "max_homes": plan.max_homes,
                    "max_sensors": plan.max_sensors,
                    "price": plan.price,
                    "duration": plan.duration_days,
                } for plan in subscription_plans
            ]
            return jsonify({"subscription_plans": subscription_plans_list}), 200
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving subscription plans",
                status_code=500
            )

    @classmethod
    def create_subscription_plan(cls, data):
        try:
            required_fields = ["name", "max_homes", "max_sensors", "price", "duration_days"]

            for field in required_fields:
                value = data.get(field)

                if value is None:
                    raise ValueError(f"'{field}' is a required field.")

                if field in ["max_homes", "max_sensors", "duration_days"] and (
                        not isinstance(value, int) or value <= 0):
                    raise ValueError(f"'{field}' must be a positive integer.")

                if field == "price" and (not isinstance(value, (float, int)) or value <= 0):
                    raise ValueError(f"'{field}' must be a positive number.")

            new_plan = cls(
                name=data["name"],
                max_homes=int(data["max_homes"]),
                max_sensors=int(data["max_sensors"]),
                price=float(data["price"]),
                duration_days=int(data["duration_days"])
            )

            db.session.add(new_plan)
            db.session.commit()

            return jsonify({"message": "Subscription plan created successfully."}), 201

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while creating subscription plan",
                status_code=500
            )

    @classmethod
    def update_subscription_plan(cls, plan_id, data):
        try:
            subscription_plan = cls.query.get(plan_id)
            if not subscription_plan:
                raise ValueError("Subscription plan not found.")

            updatable_fields = ["name", "max_homes", "max_sensors", "price", "duration_days"]

            for field in updatable_fields:
                value = data.get(field)

                if value is not None and value != "":
                    if field in ["max_homes", "max_sensors", "duration_days"] and (
                            not isinstance(value, int) or value <= 0):
                        raise ValueError(f"'{field}' must be a positive integer.")

                    if field == "price" and (not isinstance(value, (float, int)) or value <= 0):
                        raise ValueError(f"'{field}' must be a positive number.")

                    setattr(subscription_plan, field, value)

            db.session.commit()
            return jsonify({"message": "Subscription plan updated successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while updating subscription plan",
                status_code=500
            )
