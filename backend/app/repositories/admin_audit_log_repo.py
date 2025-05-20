from app.models.admin_audit_log import AdminAuditLog
from app import db

class AdminAuditLogRepository:
    @staticmethod
    def get_all():
        return AdminAuditLog.query.order_by(AdminAuditLog.created_at.desc()).all()

    @staticmethod
    def get_by_admin_id(admin_id):
        return AdminAuditLog.query.filter_by(admin_id=admin_id).order_by(AdminAuditLog.created_at.desc()).all()

    @staticmethod
    def add(admin_id, action, method, action_details=None):
        log = AdminAuditLog(
            admin_id=admin_id,
            action=action,
            method=method,
            action_details=action_details
        )
        db.session.add(log)
        db.session.commit()
        return log
