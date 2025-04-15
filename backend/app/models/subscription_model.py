from app import db
from datetime import datetime, timezone, timedelta
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import joinedload
import uuid
from flask import jsonify
from app.models.subscription_plan_model import SubscriptionPlan
from app.models.user_model import User
from app.utils import ErrorHandler


class Subscription(db.Model):
    __tablename__ = 'subscription'
    __table_args__ = (
        db.Index('idx_subscription_user_active', 'user_id', 'is_active'),
        db.Index('idx_subscription_user_id', 'user_id'),
        db.Index('idx_subscription_plan_id', 'plan_id'),
        db.Index('idx_subscription_start_date', 'start_date'),
    )

    subscription_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    plan_id = db.Column(UUID(as_uuid=True), db.ForeignKey('subscription_plan.plan_id', ondelete='CASCADE'), nullable=False)
    start_date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    end_date = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    user = db.relationship('User', back_populates='subscriptions')
    plan = db.relationship('SubscriptionPlan', back_populates='subscriptions')

    @classmethod
    def get_current_subscription(cls, user_id):
        try:
            return (
                cls.query.options(joinedload(cls.plan))
                .filter_by(user_id=user_id, is_active=True)
                .first()
            )
        except Exception as e:
            raise RuntimeError("Database error while getting user current subscription") from e

    @classmethod
    def get_current_subscription_info(cls, user_id):
        try:
            current_subscription = cls.get_current_subscription(user_id)

            if not current_subscription:
                raise ValueError("No active subscription found for the user.")

            if not current_subscription.plan:
                raise ValueError("Subscription plan not found.")

            return jsonify(current_subscription.serialize()), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving subscription info",
                status_code=500
            )

    @classmethod
    def get_user_subscriptions(cls, user_id):
        try:
            subscriptions = (
                cls.query.options(joinedload(cls.plan))
                .filter_by(user_id=user_id)
                .order_by(cls.start_date.desc())
                .all()
            )

            if not subscriptions:
                raise ValueError("No subscriptions found for the user.")

            return jsonify({
                "subscriptions": [s.serialize() for s in subscriptions]
            }), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving user subscriptions",
                status_code=500
            )

    def serialize(self):
        return {
            "subscription_id": str(self.subscription_id),
            "user_id": str(self.user_id),
            "plan": {
                "plan_id": str(self.plan.plan_id),
                "name": self.plan.name,
                "price": self.plan.price,
                "duration_days": self.plan.duration_days,
            },
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "is_active": self.is_active,
        }

    @classmethod
    def cancel_current_subscription(cls, user_id):
        try:
            current_subscription = cls.query.filter_by(user_id=user_id, is_active=True).first()

            if not current_subscription:
                raise ValueError("No active subscription found for the user.")

            if current_subscription.plan.name == 'basic':
                raise ValueError("Cannot cancel a basic subscription.")

            current_subscription.is_active = False
            current_subscription.end_date = datetime.now(timezone.utc)

            db.session.commit()

            cls.create_basic_subscription(user_id)

            return jsonify({"message": "Subscription cancelled successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while cancelling subscription",
                status_code=500
            )

    @classmethod
    def purchase_paid_subscription(cls, user_id, plan_id):
        try:
            plan = SubscriptionPlan.query.filter_by(plan_id=plan_id).first()
            if not plan:
                raise ValueError("Subscription plan not found.")

            if plan.name == 'basic':
                raise ValueError("Cannot purchase a basic plan as a paid subscription.")

            existing_subscription = cls.query.filter_by(user_id=user_id, is_active=True).first()
            if existing_subscription:
                existing_subscription.is_active = False
                existing_subscription.end_date = datetime.now(timezone.utc)

            new_subscription = cls(
                user_id=user_id,
                plan_id=plan_id,
                end_date = datetime.now(timezone.utc) + timedelta(days=plan.duration_days),
                is_active=True
            )

            user = User.query.filter_by(user_id=user_id).first()
            user.subscription_plan_name = plan.name

            db.session.add(new_subscription)
            db.session.commit()

            return jsonify({"message": "Payment successful. Paid subscription created."}), 201

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while purchasing paid subscription",
                status_code=500
            )

    @classmethod
    def extend_subscription(cls, user_id):
        try:
            active_subscription = cls.query.filter_by(user_id=user_id, is_active=True).first()
            if not active_subscription:
                raise ValueError("User does not have an active subscription.")

            active_subscription.end_date += timedelta(days=active_subscription.plan.duration_days)

            db.session.commit()

            return jsonify({"message": "Payment successful. Subscription extended."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while extending subscription",
                status_code=500
            )

    @classmethod
    def create_basic_subscription(cls, user_id):
        try:
            existing_subscription = cls.query.filter_by(user_id=user_id, is_active=True).first()
            if existing_subscription:
                raise ValueError("User already has an active subscription.")

            plan = SubscriptionPlan.query.filter_by(name='basic').first()
            if not plan:
                raise ValueError("Subscription plan not found.")

            new_subscription = cls(
                user_id=user_id,
                plan_id=plan.plan_id,
                end_date=datetime.now(timezone.utc) + timedelta(days=plan.duration_days),
                is_active=True,
            )
            user = User.query.filter_by(user_id=user_id).first()
            user.subscription_plan_name = plan.name

            db.session.add(new_subscription)
            db.session.commit()

        except ValueError as ve:
            raise ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            raise RuntimeError("Database error while creating basic subscription") from e
