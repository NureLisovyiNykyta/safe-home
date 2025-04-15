from app import db
from sqlalchemy.sql import func
import uuid
from app.utils import ErrorHandler, Validator
from flask import jsonify

class GeneralUserNotification(db.Model):
    __tablename__ = 'general_user_notifications'
    __table_args__ = (
        db.Index('idx_general_notifications_user_id', 'user_id'),
        db.Index('idx_general_notifications_created_at', 'created_at'),
    )

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    importance = db.Column(db.Enum('low', 'medium', 'high', name='importance_enum'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    type = db.Column(db.String(50), nullable=False)
    data = db.Column(db.JSON, nullable=True)

    user = db.relationship('User', back_populates='general_notifications')

    @classmethod
    def create_notification(cls, user_id, title, body, importance, type, data=None):
        new_notification = cls(
            user_id=user_id,
            title=title,
            body=body,
            importance=importance,
            type=type,
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
    def get_notifications_by_user(cls, user_id, limit="20"):
        try:
            Validator.validate_limit(limit)

            notifications = cls.query \
                .filter_by(user_id=user_id) \
                .order_by(cls.created_at.desc()) \
                .limit(limit) \
                .all()

            notifications_list = [
                {
                    "id": str(n.id),
                    "title": n.title,
                    "body": n.body,
                    "importance": n.importance,
                    "created_at": n.created_at.isoformat(),
                    "type": n.type,
                    "data": n.data
                } for n in notifications
            ]

            return jsonify({
                "notifications": notifications_list,
                "total": len(notifications_list)
            }), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving notifications",
                status_code=500
            )
