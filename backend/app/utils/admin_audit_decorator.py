from functools import wraps
from flask import request, g
from app.repositories.admin_audit_log_repo import AdminAuditLogRepository
from app.utils.audit_utils import build_create_details, build_delete_details, build_update_details

def audit_admin_action(action_description: str):
    method_to_details_builder = {
        'POST': build_create_details,
        'PUT': build_update_details,
        'PATCH': build_update_details,
        'DELETE': build_delete_details
    }

    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            response = f(*args, **kwargs)
            status_code = response[1] if isinstance(response, tuple) else response.status_code
            response_data = response[0] if isinstance(response, tuple) else response

            if status_code in (200, 201) and request.method in ('POST', 'PUT', 'PATCH', 'DELETE'):
                admin_id = str(g.user.user_id)

                details_builder = method_to_details_builder[request.method]
                action_details = details_builder(request)

                AdminAuditLogRepository.add(
                    admin_id=admin_id,
                    action=action_description.format(**kwargs),
                    method=request.method.lower(),
                    action_details=action_details
                )
            return response_data, status_code
        return wrapped
    return decorator
