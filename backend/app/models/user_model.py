from app import db
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask_login import UserMixin
from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.fernet import Fernet
from app.models.role_model import Role
from app.utils import ErrorHandler
import os

cipher = Fernet(os.getenv('SECRET_KEY_Fernet'))


class User(db.Model, UserMixin):
    __tablename__ = 'user'

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_id = db.Column(UUID(as_uuid=True), db.ForeignKey('role.role_id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256))
    google_id = db.Column(db.String(128))
    google_refresh_token = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    email_confirmed = db.Column(db.Boolean, default=False)
    subscription_plan_name = db.Column(db.String(100))

    role = db.relationship('Role', back_populates='users')

    subscriptions = db.relationship(
        'Subscription',
        back_populates='user',
        cascade="all, delete-orphan"
    )

    general_notifications = db.relationship(
        'GeneralUserNotification',
        back_populates='user',
        cascade="all, delete-orphan"
    )

    devices = db.relationship(
        'MobileDevice',
        back_populates='user',
        cascade="all, delete-orphan"
    )

    homes = db.relationship(
        'Home',
        back_populates='user',
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        if self.password is None:
            return False
        return check_password_hash(self.password, password)

    def get_id(self):
        return self.user_id

    def set_refresh_token(self, refresh_token):
        self.google_refresh_token = cipher.encrypt(refresh_token.encode()).decode()

    def get_refresh_token(self):
        if self.google_refresh_token:
            return cipher.decrypt(self.google_refresh_token.encode()).decode()
        else:
            return None


    @staticmethod
    def get_user_by_email(email):
        user = User.query.filter_by(email=email).first()
        return user

    @classmethod
    def register_user(cls, data, role):
        try:
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not name or not email or not password:
                raise ValueError("Name, email and password are required for registration.")

            user_role = Role.query.filter_by(role_name=role).first()

            user = cls(name=name, email=email, role_id = user_role.role_id)

            if password:
                user.set_password(password)

            db.session.add(user)
            db.session.commit()
            return user

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            raise RuntimeError("Database error while user register") from e

    def add_user_data(self, data):
        name = data.get('name')
        password = data.get('password')

        if name:
            self.name = name
        if password:
            self.set_password(password)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise RuntimeError("Database error while user updating") from e

    @classmethod
    def google_register_user(cls, data):
        try:
            name = data.get('name')
            email = data.get('email')
            google_id = data.get('google_id')
            refresh_token = data.get('refresh_token')

            if not name or not email:
                raise ValueError("Name and email are required for Google registration.")

            user_role = Role.query.filter_by(role_name="user").first()

            user = cls(
                name=name,
                email=email,
                google_id=google_id,
                role_id = user_role.role_id
            )
            db.session.add(user)
            db.session.commit()

            if refresh_token:
                user.set_refresh_token(refresh_token)
                db.session.commit()
            return user

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            raise RuntimeError("Database error while user google register") from e

    def add_google_data(self, google_id, refresh_token):
        try:
            self.google_id = google_id
            db.session.commit()

            if refresh_token:
                self.set_refresh_token(refresh_token)
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise Exception("Database error while adding google data") from e

    def verify_email(self):
        self.email_confirmed = True
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise RuntimeError("Database error while verifying email") from e

    def drop_email_verification(self):
        self.email_confirmed = False
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise RuntimeError("Database error while dropping email verification") from e

    @classmethod
    def get_all_users(cls):
        try:
            users = cls.query.all()
            users_list = [
                {
                    "user_id": str(user.user_id),
                    "name": user.name,
                    "email": user.email,
                    "role": user.role.role_name if user.role else None,
                    "created_at": user.created_at.isoformat(),
                    "email_confirmed": user.email_confirmed,
                    "subscription_plan_name": user.subscription_plan_name
                } for user in users if user.role.role_name == "user"
            ]
            return jsonify({"users": users_list}), 200
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving all users",
                status_code=500
            )

    @classmethod
    def get_all_admins(cls):
        try:
            users = cls.query.all()
            users_list = [
                {
                    "user_id": str(user.user_id),
                    "name": user.name,
                    "email": user.email,
                    "role": user.role.role_name if user.role else None,
                    "created_at": user.created_at.isoformat(),
                    "email_confirmed": user.email_confirmed,
                } for user in users if user.role.role_name == "admin"
            ]
            return jsonify({"admins": users_list}), 200
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving all admins",
                status_code=500
            )

    @classmethod
    def get_user(cls, user_id):
        try:
            if not user_id:
                raise ValueError("'user_id' is a required parameter.")

            user = cls.query.filter_by(user_id=user_id).first()
            if not user:
                return ErrorHandler.handle_error(
                    None,
                    message="User not found",
                    status_code=404
                )

            user_data = {
                "user_id": str(user.user_id),
                "name": user.name,
                "email": user.email,
                "role": user.role.role_name if user.role else None,
                "created_at": user.created_at.isoformat(),
                "email_confirmed": user.email_confirmed,
                "subscription_plan_name": user.subscription_plan_name
            }
            return jsonify({"user": user_data}), 200
        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving user by ID",
                status_code=500
            )

    @classmethod
    def delete_user(cls, user_id):
        try:
            if not user_id:
                raise ValueError("'user_id' is a required parameter.")

            user = cls.query.filter_by(user_id=user_id).first()
            if not user:
                return ErrorHandler.handle_error(
                    None,
                    message="User not found",
                    status_code=404
                )

            db.session.delete(user)
            db.session.commit()

            return jsonify({"message": "User deleted successfully."}), 200
        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while deleting user",
                status_code=500
            )

    @classmethod
    def update_user_profile(cls, user_id, data):
        try:
            name = data.get('name')

            if not name:
                raise ValueError("Name is required.")

            user = cls.query.filter_by(user_id=user_id).first()
            if not user:
                return ErrorHandler.handle_error(
                    None,
                    message=f"User with ID '{user_id}' not found.",
                    status_code=404
                )

            user.name = name

            db.session.commit()
            return jsonify({'message': 'User data updated successfully.'}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Internal server error while updating the user profile.",
                status_code=500
            )

    @classmethod
    def update_user_password(cls, user_id, data):
        try:
            old_password = data.get('old_password')
            new_password = data.get('new_password')

            user = cls.query.filter_by(user_id=user_id).first()
            if not user:
                return ErrorHandler.handle_error(
                    None,
                    message=f"User with ID '{user_id}' not found.",
                    status_code=404
                )

            if user.check_password(old_password):
                if new_password:
                    user.set_password(new_password)
                else:
                    raise ValueError("New password is required.")
            else:
                raise ValueError("Invalid old password.")

            db.session.commit()
            return jsonify({'message': 'Password updated successfully.'}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Internal server error while updating password.",
                status_code=500
            )
