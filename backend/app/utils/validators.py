import re


class Validator:
    EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    NAME_REGEX = r'^[a-zA-Zа-яА-Я\s-]{2,100}$'

    @staticmethod
    def validate_required_fields(data: dict, required_fields: list) -> None:
        """Validate that all required fields are present and not empty."""
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

    @staticmethod
    def validate_email(email: str) -> None:
        """Validate email format using regex."""
        if not re.match(Validator.EMAIL_REGEX, email):
            raise ValueError("Invalid email format")

    @staticmethod
    def validate_name(name: str) -> None:
        """Validate name format using regex."""
        if not re.match(Validator.NAME_REGEX, name):
            raise ValueError("Invalid name format")

    @staticmethod
    def validate_password(password: str) -> None:
        """Validate password strength."""
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")

    @staticmethod
    def validate_limit(limit: str) -> None:
        """Validate limit is a positive integer."""
        try:
            limit_int = int(limit)
            if limit_int <= 0:
                raise ValueError("Limit must be positive")
        except (ValueError, TypeError):
            raise ValueError("Limit must be a positive integer")
