from app import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import jsonify
from app.models.subscription_model import Subscription
from app.models.home_model import Home, DefaultSecurityMode
from app.services.mobile_sequrity_notification_service import send_sensor_activity_change_notification
from app.services.mobile_sequrity_notification_service import send_sensor_security_breached_notification
from app.services.mobile_sequrity_notification_service import send_active_sensor_status_changed_notification
from app.utils import ErrorHandler

class Sensor(db.Model):
    __tablename__ = 'sensor'

    sensor_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    home_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey('home.home_id', ondelete='CASCADE'),
        nullable=False
    )
    user_id = db.Column(db.UUID(as_uuid=True), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    is_closed = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=False)
    is_security_breached = db.Column(db.Boolean, default=False)
    is_archived = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    home = db.relationship('Home', back_populates='sensors')

    @classmethod
    def get_all_sensors(cls, home_id):
        try:
            sensors = cls.query.filter_by(home_id=home_id).all()
            sensors_list = [
                {
                    "sensor_id": str(sensor.sensor_id),
                    "name": sensor.name,
                    "type": sensor.type,
                    "is_closed": sensor.is_closed,
                    "is_active": sensor.is_active,
                    "is_security_breached": sensor.is_security_breached,
                    "created_at": sensor.created_at.isoformat(),
                    "is_archived": sensor.is_archived
                }
                for sensor in sensors
            ]

            return jsonify({"sensors": sensors_list}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving sensors",
                status_code=500
            )

    @classmethod
    def add_sensor(cls, user_id, data):
        try:
            home_id = data.get('home_id')
            name = data.get('name')
            type = data.get('type')

            if not home_id or not name or not type:
                raise ValueError("Home id, name and type are required.")

            home = Home.query.filter_by(home_id=home_id, user_id=user_id, is_archived=False).first()
            if not home:
                raise ValueError("Active home not found for the user.")

            current_subscription = Subscription.get_current_subscription(user_id)
            if not current_subscription:
                raise ValueError("User does not have an active subscription.")

            current_sensors_count = cls.query.filter_by(user_id=user_id, is_archived=False).count()
            if current_sensors_count >= current_subscription.plan.max_sensors:
                raise ValueError("You have reached the maximum number of sensors allowed by your subscription.")

            new_sensor = cls(
                home_id=home_id,
                user_id=user_id,
                name=name,
                type=type,
            )
            db.session.add(new_sensor)
            db.session.commit()

            return jsonify({"message": "Sensor added successfully."}), 201

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while adding sensor",
                status_code=500
            )

    @classmethod
    def delete_sensor(cls, user_id, sensor_id):
        try:
            sensor = cls.query.filter_by(user_id=user_id, sensor_id=sensor_id).first()
            if not sensor:
                raise ValueError("Sensor not found for the specified user.")

            db.session.delete(sensor)
            db.session.commit()

            return jsonify({"message": "Sensor  was deleted successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while deleting sensor",
                status_code=500
            )

    @classmethod
    def set_sensor_activity(cls, user_id, sensor_id, is_active):
        try:
            sensor = cls.query.filter_by(user_id=user_id, sensor_id=sensor_id, is_archived=False).first()
            if not sensor:
                raise ValueError("Sensor not found for the specified user.")

            if sensor.is_active == is_active:
                return jsonify({"message": "No changes needed, sensor activity remains the same."}), 200

            if is_active and not sensor.is_closed:
                raise ValueError("Sensor can't be set as active. Close device connected to sensor.")

            sensor.is_active = is_active
            sensor.is_security_breached = False

            db.session.commit()

            home = sensor.home

            all_sensors_status = all(s.is_active == is_active for s in home.sensors if not s.is_archived)
            all_sensors_not_breached = all(s.is_security_breached == False for s in home.sensors if not s.is_archived)

            # Determine the new security mode for the home based on sensor statuses:
            # 1. If all sensors are active and none are breached → set mode to "armed".
            # 2. If all sensors are inactive → set mode to "disarmed".
            # 3. If some sensors are active but none are breached → set mode to "custom".
            # 4. Otherwise, keep the current security mode.
            if all_sensors_status and is_active and all_sensors_not_breached:
                mode_name = "armed"
            elif all_sensors_status and not is_active:
                mode_name = "disarmed"
            elif all_sensors_not_breached:
                mode_name = "custom"
            else:
                mode_name = home.default_mode.mode_name  # Retain the current mode if conditions don't match.

            default_mode = DefaultSecurityMode.get_security_mode(mode_name)
            home.default_mode_id = default_mode.mode_id

            db.session.commit()

            send_sensor_activity_change_notification(user_id, sensor, is_active, default_mode.mode_name)

            return jsonify({"message": f"Sensor was turned {'on' if is_active else 'off'} successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while setting sensor activity",
                status_code=500
            )

    @classmethod
    def set_sensor_status(cls, user_id, data):
        try:
            sensor_id = data.get('sensor_id')
            is_closed = str(data.get('is_closed')).lower()
            if not sensor_id or is_closed not in ['true', 'false', '1', '0']:
                raise ValueError("Sensor ID and valid 'is_closed' status are required.")

            bool_is_closed = is_closed in ['true', '1']

            sensor = cls.query.filter_by(user_id=user_id, sensor_id=sensor_id, is_archived=False).first()
            if not sensor:
                raise ValueError("Sensor not found for the specified user.")

            if sensor.is_closed == bool_is_closed:
                return jsonify({"message": "No changes needed, sensor status remains the same."}), 200

            sensor.is_closed = bool_is_closed
            db.session.commit()

            if sensor.is_active:

                # Если сенсор активен и стал открытым, проверяем, не нарушена ли безопасность
                if not bool_is_closed and not sensor.is_security_breached:
                    sensor.is_security_breached = True
                    home = sensor.home
                    default_mode = DefaultSecurityMode.get_security_mode("alert")
                    home.default_mode_id = default_mode.mode_id
                    db.session.commit()
                    send_sensor_security_breached_notification(user_id, sensor)
                else:
                    send_active_sensor_status_changed_notification(user_id, sensor)

            return jsonify({"message": f"Sensor status 'is_closed' was set as {bool_is_closed}."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while setting sensor status",
                status_code=500
            )

    @classmethod
    def unarchive_sensor(cls, user_id, sensor_id):
        try:
            sensor = cls.query.filter_by(sensor_id=sensor_id, user_id=user_id, is_archived=True).first()
            if not sensor:
                raise ValueError("Archived sensor not found for the user.")

            current_subscription = Subscription.get_current_subscription(user_id)
            if not current_subscription:
                raise ValueError("User does not have an active subscription.")

            current_sensors_count = cls.query.filter_by(user_id=user_id, is_archived=False).count()
            if current_sensors_count >= current_subscription.plan.max_sensors:
                raise ValueError("You have reached the maximum number of sensors allowed by your subscription.")

            sensor.is_archived = False
            db.session.commit()

            return jsonify({"message": "Sensor unarchived successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while unarchiving sensor",
                status_code=500
            )

    @classmethod
    def archive_sensor(cls, user_id, sensor_id):
        try:
            sensor = cls.query.filter_by(sensor_id=sensor_id, user_id=user_id, is_archived=False).first()
            if not sensor:
                raise ValueError("Active sensor not found for the user.")

            sensor.is_archived = True
            sensor.is_closed = False
            sensor.is_active = False
            sensor.is_security_breached = False
            db.session.commit()

            return jsonify({"message": "Sensor archived successfully."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while archiving sensor",
                status_code=500
            )
