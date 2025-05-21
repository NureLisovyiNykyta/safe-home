from app.utils.error_handler import handle_errors, UnprocessableError
from app.repositories.admin_audit_log_repo import AdminAuditLogRepository
from flask import jsonify

class AdminAuditLogService:
    @staticmethod
    @handle_errors
    def get_all_admin_audit_logs():
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
