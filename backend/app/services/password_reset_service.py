from flask_mail import Message
from app import mail, db
from app.models import User
import random
import string
from app.config import Config
from itsdangerous import URLSafeTimedSerializer
from flask import url_for, render_template_string, jsonify
from app.utils import ErrorHandler

s = URLSafeTimedSerializer(Config.SECRET_KEY)


def reset_password_request(data):
    try:
        if not data or not data.get('email'):
            raise ValueError("Email is required")

        user = User.get_user_by_email(data['email'])
        if not user:
            return ErrorHandler.handle_error(
                None,
                message=f"User with email '{data['email']}' not found.",
                status_code=404
            )

        reset_password_confirmation(user)

    except ValueError as ve:
        return ErrorHandler.handle_validation_error(str(ve))
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending the password reset email.",
            status_code=500
        )

def reset_password_confirmation(user):
    try:
        token = s.dumps(user.email, salt='reset_password-confirm-salt')
        confirmation_url = url_for('user_profile.confirm_reset_password', token=token, _external=True)

        with open("templates/reset_password_confirmation.html", "r") as html_file:
            html_template = html_file.read()

        html_body = render_template_string(
            html_template,
            name=user.name,
            confirmation_url=confirmation_url
        )

        msg = Message(
            "Reset password confirmation",
            recipients=[user.email],
            body=f"To confirm your email address, "
                 f"visit the following link: {confirmation_url}",
            html=html_body)

        mail.send(msg)
        return jsonify({'message': 'The confirmation was sent successfully.'}), 200

    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending the email confirmation.",
            status_code=500
        )


def verify_reset_password_token(token):
    try:
        email = s.loads(token, salt='reset_password-confirm-salt', max_age=3600)
        user = User.query.filter_by(email=email).first()

        if user is None:
            raise PermissionError('The token is invalid or expired.')

        send_password_reset_email(user)

        with open("templates/email_confirmation_success.html", "r") as html_file:
            success_html_template = html_file.read()

        success_html_body = render_template_string(
            success_html_template,
            user=user
        )

        return success_html_body

    except PermissionError as pe:
        with open("templates/email_confirmation_error.html", "r") as html_file:
            error_html_template = html_file.read()

        error_html_body = render_template_string(
            error_html_template,
            error_message=str(pe)
        )

        return error_html_body

    except RuntimeError as re:
        with open("templates/email_confirmation_error.html", "r") as html_file:
            error_html_template = html_file.read()

        error_html_body = render_template_string(
            error_html_template,
            error_message=str(re)
        )
        return error_html_body

    except Exception as e:
        with open("templates/email_confirmation_error.html", "r") as html_file:
            error_html_template = html_file.read()

        error_html_body = render_template_string(
            error_html_template,
            error_message=f"Internal server error during email confirmation. {str(e)}"
        )
        return error_html_body

def send_password_reset_email(user):
    try:

        new_password = generate_random_password()
        update_password(user, new_password)

        with open("templates/password_reset_email.html", "r") as html_file:
            html_template = html_file.read()

        html_body = render_template_string(
            html_template,
            name=user.name,
            new_password=new_password
        )

        msg = Message(
            "Your New Password",
            recipients=[user.email],
            body=f"Your new password is: {new_password}\n"
                 f"You can log in using this password. "
                 f"Please change it after logging in.",
            html=html_body
        )

        mail.send(msg)
        return jsonify({'message': 'A new password has been sent to your email.'}), 200

    except ValueError as ve:
        return ErrorHandler.handle_validation_error(str(ve))
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending the password reset email.",
            status_code=500
        )


def generate_random_password(length=8):
    try:
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for _ in range(length))
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while generating the random password.",
            status_code=500
        )


def update_password(user, new_password):
    try:
        user.set_password(new_password)
        db.session.commit()
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while updating the user's password.",
            status_code=500
        )
