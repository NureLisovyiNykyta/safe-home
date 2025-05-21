from flask import request
from flask import g


def build_create_details(request):
    """Generates details for POST requests (create)."""
    json_data = request.get_json(silent=True) or {}
    filtered_data = {k: v for k, v in json_data.items() if k not in ['password']}
    return {
        'action': 'create',
        'created_data': getattr(g, 'created_data', filtered_data)
    }

def build_delete_details(request):
    """Generates details for DELETE requests."""
    return {
        'action': 'delete',
        'deleted_data': getattr(g, 'deleted_data', None)
    }


def build_update_details(request):
    """Generates details for PUT/PATCH requests (update)."""
    json_data = request.get_json(silent=True) or {}
    filtered_data = {k: v for k, v in json_data.items() if k not in ['password']}

    old_data = getattr(g, 'old_data', None)
    new_data = getattr(g, 'new_data', filtered_data)

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

    return {
        'action': 'update',
        'updated_data': merged_data
    }