from functools import wraps
from flask import request


def success_trigger(message: str = None, handler=None):
    """
    Универсальный декоратор для обработки успешных ответов роута.

    Args:
        message (str): Сообщение для обработки (может быть шаблоном с {kwargs}).
        handler (callable): Функция-обработчик, вызываемая при успешном ответе.
                           Принимает response_data, status_code, request, kwargs.
    """

    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            response = f(*args, **kwargs)
            status_code = response[1] if isinstance(response, tuple) else response.status_code
            response_data = response[0] if isinstance(response, tuple) else response

            if status_code in (200, 201):

                formatted_message = message.format(**kwargs) if message else None

                if handler:
                    handler(response_data, status_code, request, kwargs, formatted_message)

            return response_data, status_code

        return wrapped

    return decorator