from flask import jsonify, g, request
from app.utils import Validator
from app.utils.error_handler import handle_errors, UnprocessableError
from app.repositories.admin_audit_log_repo import AdminAuditLogRepository

class AdminAuditLogService:
    @staticmethod
    @handle_errors
    def get_admin_audit_logs(days = None):
        if days is not None:
            Validator.validate_positive_integer(days, "days")
            logs = AdminAuditLogRepository.get_audit_logs_by_days(days)
        else:
            logs = AdminAuditLogRepository.get_all()
        admin_audit_logs = [
            {
                'log_id': str(log.log_id),
                'admin_id': str(log.admin_id),
                'admin_email': log.admin.email,
                'admin_name': log.admin.name,
                'action': log.action,
                'method': log.method,
                'action_details': log.action_details,
                'created_at': log.created_at.isoformat()
            } for log in logs
        ]
        return jsonify({"admin_audit_logs": admin_audit_logs}), 200

    @staticmethod
    def build_create_audit_log(response_data, status_code, request, kwargs, message):
        """Build admin audit log for POST requests (create)."""
        admin_id = str(g.user.user_id)
        details = {
            'action': 'create',
            'details': getattr(g, 'created_data', None)
        }
        AdminAuditLogRepository.add(
            admin_id=admin_id,
            action=message,
            method=request.method.lower(),
            action_details=details
        )

    @staticmethod
    def build_delete_audit_log(response_data, status_code, request, kwargs, message):
        """Bild admin audit log for DELETE requests."""
        admin_id = str(g.user.user_id)
        details = {
            'action': 'delete',
            'details': getattr(g, 'deleted_data', None)
        }
        AdminAuditLogRepository.add(
            admin_id=admin_id,
            action=message,
            method=request.method.lower(),
            action_details=details
        )

    @staticmethod
    def build_update_audit_log(response_data, status_code, request, kwargs, message):
        """Bild admin audit log for PUT/PATCH requests (update)."""
        admin_id = str(g.user.user_id)

        old_data = getattr(g, 'old_data', {})
        new_data = getattr(g, 'new_data', {})

        # get all unique keys from both dictionaries
        all_keys = set(old_data.keys()) | set(new_data.keys())
        merged_data = {}

        for key in all_keys:
            old_value = old_data.get(key)
            new_value = new_data.get(key)

            if old_value == new_value:
                # don't change the value if they are the same
                merged_data[key] = old_value or new_value
            elif old_value is None:
                # value added in new_data
                merged_data[key] = f"added {new_value}"
            elif new_value is None:
                # value removed in new_data
                merged_data[key] = f"removed {old_value}"
            else:
                # value changed in new_data
                merged_data[key] = f"from {old_value} to {new_value}"

        details = {
            'action': 'update',
            'details': merged_data
        }
        AdminAuditLogRepository.add(
            admin_id=admin_id,
            action=message,
            method=request.method.lower(),
            action_details=details
        )
