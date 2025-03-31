from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import jsonify
from app.utils import ErrorHandler


class DefaultSecurityMode(db.Model):
    __tablename__ = 'default_security_mode'

    mode_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mode_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    is_selectable = db.Column(db.Boolean, default=False)

    homes = db.relationship('Home', back_populates='default_mode')

    @classmethod
    def get_all_default_modes(cls):
        try:
            default_modes = cls.query.filter_by().all()
            default_modes = [
                {
                    "mode_id": str(mode.mode_id),
                    "mode_name": mode.mode_name,
                    "description": mode.description,
                    "is_selectable": mode.is_selectable
                } for mode in default_modes
            ]
            return jsonify({"default_modes": default_modes}), 200
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving default modes",
                status_code=500
            )

    @staticmethod
    def get_security_mode(mode_name):
        mode = DefaultSecurityMode.query.filter_by(mode_name=mode_name).first()
        if not mode:
            raise ValueError(f"Default security mode '{mode_name}' not found.")
        return mode
