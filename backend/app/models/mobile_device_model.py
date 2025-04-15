from app import db
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import jsonify
from app.utils import ErrorHandler


class MobileDevice(db.Model):
    __tablename__ = 'mobile_device'
    __table_args__ = (
        db.Index('idx_mobile_device_user_id', 'user_id'),
        db.Index('idx_mobile_device_token', 'device_token'),
        db.Index('idx_mobile_device_user_token', 'user_id', 'device_token'),
    )

    user_device_id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey('user.user_id', ondelete='CASCADE'),
        nullable=False
    )
    device_token = db.Column(db.String, nullable=False)
    device_info = db.Column(db.String(256), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = db.relationship('User', back_populates='devices')


    def get_device_token(self):
        if self.device_token:
            return self.device_token
        else:
            return None

    @classmethod
    def get_user_devices(cls, user_id):
        try:
            # Retrieve all devices for a user
            user_devices = cls.query.filter_by(user_id=user_id).all()
            devices = []
            for device in user_devices:
                devices.append({
                    "user_device_id": str(device.user_device_id),
                    "device_token": str(device.get_device_token()),
                    "device_info": device.device_info,
                    "created_at": device.created_at.isoformat()
                })

            return jsonify({'devices': devices}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving devices",
                status_code=500
            )

    @classmethod
    def add_user_device(cls, user_id, data):
        try:
            device_token = data.get('device_token')
            device_info = data.get('device_info')

            if not device_token:
                raise ValueError("Device token is required.")

            # Check if the device already exists for this user
            existing_device = cls.query.filter(cls.device_token == device_token).first()
            if existing_device:
                if existing_device.user_id == user_id:
                    raise ValueError("This device is already registered for the user.")
                # If the device token already exists for a different user, delete it
                db.session.delete(existing_device)
                db.session.commit()

            # Create a new user device
            new_device = cls(user_id=user_id, device_info=device_info, device_token=device_token)

            db.session.add(new_device)
            db.session.commit()

            return jsonify({'message': "Device was successfully added to the user.", 'device_id': str(new_device.user_device_id)}), 201

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while adding device to user",
                status_code=500
            )

    @classmethod
    def delete_device_by_token_and_user(cls, user_id, data):
        try:
            device_token = data.get('device_token')

            if not device_token:
                raise ValueError("Device token is required.")

            # Find the device by user_id and token
            user_device = cls.query.filter_by(user_id=user_id, device_token=device_token).first()
            if not user_device:
                raise ValueError("Device not found for the specified user and token.")

            db.session.delete(user_device)
            db.session.commit()

            return jsonify({'message': "Device was successfully removed for the user."}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while deleting device by token and user",
                status_code=500
            )
