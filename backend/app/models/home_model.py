from app import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import jsonify
from app.models.default_security_mode_model import DefaultSecurityMode
from app.models.subscription_model import Subscription
from app.services.mobile_sequrity_notification_service import send_security_mode_change_notification
from app.utils import ErrorHandler


class Home(db.Model):
    __tablename__ = 'home'

    home_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    default_mode_id = db.Column(UUID(as_uuid=True), db.ForeignKey('default_security_mode.mode_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    is_archived = db.Column(db.Boolean, default=False)

    user = db.relationship('User', back_populates='homes')
    default_mode = db.relationship('DefaultSecurityMode', back_populates='homes')

    sensors = db.relationship(
        'Sensor',
        back_populates='home',
        cascade="all, delete-orphan"
    )

    security_notifications = db.relationship(
        'SecurityUserNotification',
        back_populates='home',
        cascade="all, delete-orphan"
    )


    @classmethod
    def get_all_homes(cls, user_id):
        try:
            homes = cls.query.filter_by(user_id=user_id).all()
            homes_list = [
                {
                    "home_id": str(home.home_id),
                    "name": home.name,
                    "address": home.address,
                    "created_at": home.created_at.isoformat(),
                    "default_mode_id": str(home.default_mode_id),
                    "default_mode_name": home.default_mode.mode_name,
                    "is_archived": home.is_archived
                } for home in homes
            ]
            return jsonify({"homes": homes_list}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving homes",
                status_code=500
            )

    @classmethod
    def add_home(cls, user_id, data):
        try:
            name = data.get('name')
            address = data.get('address')

            if not name and not address:
                raise ValueError("Name and address are required.")

            current_subscription = Subscription.get_current_subscription(user_id)
            if not current_subscription:
                raise ValueError("User does not have an active subscription.")

            current_homes_count = cls.query.filter_by(user_id=user_id, is_archived=False).count()
            if current_homes_count >= current_subscription.plan.max_homes:
                raise ValueError("You have reached the maximum number of homes allowed by your subscription.")

            default_mode = DefaultSecurityMode.get_security_mode("disarmed")

            new_home = cls(
                user_id=user_id,
                name=name,
                address=address,
                default_mode_id=default_mode.mode_id
            )
            db.session.add(new_home)
            db.session.commit()

            return jsonify({"message": "Home added successfully."}), 201

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while adding home",
                status_code=500
            )

    @classmethod
    def delete_home(cls, user_id, home_id):
        try:
            home = cls.query.filter_by(user_id = user_id, home_id = home_id).first()
            if not home:
                raise ValueError("Home not found for the user.")

            db.session.delete(home)
            db.session.commit()

            return jsonify({"message": "Home was deleted successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while deleting home",
                status_code=500
            )

    @classmethod
    def unarchive_home(cls, user_id, home_id):
        try:
            home = cls.query.filter_by(home_id=home_id, user_id=user_id, is_archived=True).first()
            if not home:
                raise ValueError("Archived home not found for the user.")

            current_subscription = Subscription.get_current_subscription(user_id)
            if not current_subscription:
                raise ValueError("User does not have an active subscription.")

            current_homes_count = cls.query.filter_by(user_id=user_id, is_archived=False).count()
            if current_homes_count >= current_subscription.plan.max_homes:
                raise ValueError("You have reached the maximum number of homes allowed by your subscription.")

            home.is_archived = False

            db.session.commit()

            return jsonify({"message": "Home unarchived successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while unarchiving home",
                status_code=500
            )

    @classmethod
    def archive_home_sensors(cls, user_id, home_id):
        try:
            home = cls.query.filter_by(user_id=user_id, home_id=home_id, is_archived=False).first()
            if not home:
                raise ValueError("Home not found for the user.")

            cls.archive_home(home)
            db.session.commit()
            return jsonify({"message": "Home and its sensors archived successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while archiving home and sensors",
                status_code=500
            )

    @classmethod
    def set_armed_security_mode(cls, user_id, home_id):
        try:
            home = cls.query.filter_by(user_id=user_id, home_id=home_id, is_archived=False).first()
            if not home:
                raise ValueError("Home not found for the user.")

            default_mode = DefaultSecurityMode.get_security_mode("armed")

            if any(not sensor.is_closed and not sensor.is_archived for sensor in home.sensors):
                return jsonify({"message": "Armed mode cannot be set! Close all your devices connected to sensors."}), 200

            cls._arm_sensors(home)
            home.default_mode_id = default_mode.mode_id
            db.session.commit()

            send_security_mode_change_notification(user_id, home, default_mode)

            return jsonify({"message": "Home armed successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while arming home",
                status_code=500
            )

    @classmethod
    def set_disarmed_security_mode(cls, user_id, home_id):
        try:
            home = cls.query.filter_by(user_id=user_id, home_id=home_id, is_archived=False).first()
            if not home:
                raise ValueError("Home not found for the user.")

            default_mode = DefaultSecurityMode.get_security_mode("disarmed")

            cls._disarm_sensors(home)
            home.default_mode_id = default_mode.mode_id
            db.session.commit()

            send_security_mode_change_notification(user_id, home, default_mode)

            return jsonify({"message": "Home disarmed successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while disarming home",
                status_code=500
            )

    @staticmethod
    def archive_home(home):
        default_mode = DefaultSecurityMode.query.filter_by(mode_name="disarmed").first()

        home.default_mode_id = default_mode.mode_id
        home.is_archived = True

        for sensor in home.sensors:
            sensor.is_archived = True
            sensor.is_closed = False
            sensor.is_active = False
            sensor.is_security_breached = False

    @staticmethod
    def _disarm_sensors(home):
        for sensor in home.sensors:
            if not sensor.is_archived:
                sensor.is_active = False
                sensor.is_closed = False
                sensor.is_security_breached = False

    @staticmethod
    def _arm_sensors(home):
        for sensor in home.sensors:
            if not sensor.is_archived:
                sensor.is_active = True
                sensor.is_security_breached = False
