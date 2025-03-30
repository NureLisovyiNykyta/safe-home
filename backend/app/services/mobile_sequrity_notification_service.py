from app.utils import ErrorHandler
from app.models.security_user_notification import SecurityUserNotification
from app.utils import send_notification

def send_security_mode_change_notification(user_id, home, new_mode):
    try:
        title = "Security Mode Change Notice"
        body = f"Your home '{home.name}' security mode has been changed to {new_mode.mode_name}, {new_mode.description}."
        data = {
            'title': title,
            'new_mode_name': f'{new_mode.mode_name}',
            'home_id': f'{home.home_id}',
            'home_name': f'{home.name}',
        }

        SecurityUserNotification.create_notification(
            home_id=home.home_id,
            title=title,
            body=body,
            importance="medium",
            type="security_mode_change",
            user_id=user_id,
            data={
                "new_mode_name": new_mode.mode_name
            },
        )

        send_notification(user_id, title, body, data)

    except ValueError as ve:
        print(ErrorHandler.handle_validation_error(str(ve)))
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending security mode change notification.",
            status_code=500
        )


def send_sensor_activity_change_notification(user_id, sensor, new_activity, new_mode_name):
    try:
        title = "Sensor Activity Change Notice"
        body = (f"Sensor '{sensor.name}' in home '{sensor.home.name}' was turned {'on' if new_activity else 'off'}. "
                f"Default security mode is set to {new_mode_name}.")

        data = {
            'title': title,
            'sensor_id': f'{sensor.sensor_id}',
            'sensor_name': f'{sensor.name}',
            'home_id': f'{sensor.home_id}',
            'home_name': f'{sensor.home.name}',
            'new_activity': f'{new_activity}',
            'new_mode_name': f'{new_mode_name}'
        }

        SecurityUserNotification.create_notification(
            home_id=sensor.home_id,
            title=title,
            body=body,
            importance="medium",
            type="sensor_activity_change",
            sensor_id=sensor.sensor_id,
            user_id=user_id,
            data={
                "new_activity": new_activity
            },
        )

        send_notification(user_id, title, body, data)

    except ValueError as ve:
        print(ErrorHandler.handle_validation_error(str(ve)))
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending sensor activity change notification.",
            status_code=500
        )

def send_active_sensor_status_changed_notification(user_id, sensor):
    try:
        title = "Sensor Status Change Notice"
        body = (f"The {sensor.type} '{sensor.name}'in home '{sensor.home.name}' "
                f"was {'closed' if sensor.is_closed else 'opened'}.")
        data = {
            'title': title,
            'sensor_id': f'{sensor.sensor_id}',
            'sensor_name': f'{sensor.name}',
            'home_id': f'{sensor.home_id}',
            'home_name': f'{sensor.home.name}',
            'new_status': f'{sensor.is_active}'
        }

        SecurityUserNotification.create_notification(
            home_id=sensor.home_id,
            title=title,
            body=body,
            importance="high",
            type="sensor_status_change",
            sensor_id=sensor.sensor_id,
            user_id=user_id
        )

        send_notification(user_id, title, body, data)

    except ValueError as ve:
        print(ErrorHandler.handle_validation_error(str(ve)))
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending sensor activity change notification.",
            status_code=500
        )

def send_sensor_security_breached_notification(user_id, sensor):
    try:
        title = "Sensor Security Breached"
        body = (f"The security of sensor '{sensor.name}'in home '{sensor.home.name}' was Breached. "
                f"Check the situation and fix the problem by deactivate and activate sensor again.")
        data = {
            'title': title,
            'sensor_id': f'{sensor.sensor_id}',
            'sensor_name': f'{sensor.name}',
            'home_id': f'{sensor.home_id}',
            'home_name': f'{sensor.home.name}',
        }

        SecurityUserNotification.create_notification(
            home_id=sensor.home_id,
            title=title,
            body=body,
            importance="high",
            type="sensor_security_breached",
            sensor_id=sensor.sensor_id,
            user_id=user_id
        )

        send_notification(user_id, title, body, data)

    except ValueError as ve:
        print(ErrorHandler.handle_validation_error(str(ve)))
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending sensor activity change notification.",
            status_code=500
        )
