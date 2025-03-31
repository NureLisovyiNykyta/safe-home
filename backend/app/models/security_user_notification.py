from app import db
import uuid
from app.utils import ErrorHandler
from flask import jsonify
from sqlalchemy.sql import func

class SecurityUserNotification(db.Model):
    __tablename__ = 'security_user_notifications'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    home_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('home.home_id', ondelete='CASCADE'), nullable=False)
    sensor_id = db.Column(db.UUID(as_uuid=True), nullable=True)
    user_id = db.Column(db.UUID(as_uuid=True), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    importance = db.Column(db.Enum('low', 'medium', 'high', name='importance_enum'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    type = db.Column(db.String(50), nullable=False)
    data = db.Column(db.JSON, nullable=True)

    home = db.relationship('Home', back_populates='security_notifications')

    @classmethod
    def create_notification(cls, home_id, title, body, importance, type, user_id, sensor_id=None, data=None):
        new_notification = cls(
            home_id=home_id,
            title=title,
            body=body,
            importance=importance,
            type=type,
            user_id=user_id,
            sensor_id=sensor_id,
            data=data
        )
        try:
            db.session.add(new_notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while creating notification",
                status_code=500
            )

    @classmethod
    def get_notifications_by_home(cls, home_id):
        try:
            notifications = cls.query.filter_by(home_id=home_id).order_by(cls.created_at.desc()).all()

            notifications_list = [
                {
                    "id": str(notification.id),
                    "home_id": str(notification.home_id),
                    "sensor_id": str(notification.sensor_id) if notification.sensor_id else None,
                    "title": notification.title,
                    "body": notification.body,
                    "importance": notification.importance,
                    "created_at": notification.created_at.isoformat(),
                    "type": notification.type,
                    "data": notification.data
                } for notification in notifications
            ]

            return jsonify({"notifications": notifications_list}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving notifications",
                status_code=500
            )

    @classmethod
    def get_notifications_by_user(cls, user_id):
        try:
            notifications = cls.query.filter_by(user_id=user_id).order_by(cls.created_at.desc()).all()

            notifications_list = [
                {
                    "id": str(notification.id),
                    "home_id": str(notification.home_id),
                    "sensor_id": str(notification.sensor_id) if notification.sensor_id else None,
                    "title": notification.title,
                    "body": notification.body,
                    "importance": notification.importance,
                    "created_at": notification.created_at.isoformat(),
                    "type": notification.type,
                    "data": notification.data
                } for notification in notifications
            ]

            return jsonify({"notifications": notifications_list}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving notifications",
                status_code=500
            )
