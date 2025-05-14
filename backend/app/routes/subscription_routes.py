from flask import Blueprint, request
from app.services.subscription_service import SubscriptionService
from app.utils.auth_decorator import auth_required, role_required
from app.utils.error_handler import handle_errors, ValidationError
from flasgger import swag_from

subscription_bp = Blueprint('subscription', __name__)


@subscription_bp.route('/subscriptions/current', methods=['GET'])
@swag_from({
    'summary': 'Get the current active subscription for the authenticated user',
    'responses': {
        200: {
            'description': 'Current subscription details',
            'schema': {
                'type': 'object',
                'properties': {
                    'subscription_id': {'type': 'string'},
                    'user_id': {'type': 'string'},
                    'plan': {
                        'type': 'object',
                        'properties': {
                            'plan_id': {'type': 'string'},
                            'name': {'type': 'string'},
                            'price': {'type': 'number'},
                            'duration_days': {'type': 'integer'}
                        }
                    },
                    'start_date': {'type': 'string'},
                    'end_date': {'type': 'string'},
                    'is_active': {'type': 'boolean'}
                }
            }
        },
        401: {'description': 'Unauthorized'},
        422: {'description': 'Unprocessable entity'},
        500: {'description': 'Internal server error'}
    }
})
@role_required(['user'])
@handle_errors
def get_current_subscription_info():
    user_id = request.current_user.user_id
    return SubscriptionService.get_current_subscription_info(user_id)


@subscription_bp.route('/subscriptions', methods=['GET'])
@swag_from({
    'summary': 'Get all subscriptions for the authenticated user',
    'responses': {
        200: {
            'description': 'List of subscriptions',
            'schema': {
                'type': 'object',
                'properties': {
                    'subscriptions': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'subscription_id': {'type': 'string'},
                                'user_id': {'type': 'string'},
                                'plan': {
                                    'type': 'object',
                                    'properties': {
                                        'plan_id': {'type': 'string'},
                                        'name': {'type': 'string'},
                                        'price': {'type': 'number'},
                                        'duration_days': {'type': 'integer'}
                                    }
                                },
                                'start_date': {'type': 'string'},
                                'end_date': {'type': 'string'},
                                'is_active': {'type': 'boolean'}
                            }
                        }
                    }
                }
            }
        },
        401: {'description': 'Unauthorized'},
        422: {'description': 'Unprocessable entity'},
        500: {'description': 'Internal server error'}
    }
})
@role_required(['user'])
@handle_errors
def get_user_subscriptions():
    user_id = request.current_user.user_id
    return SubscriptionService.get_user_subscriptions(user_id)


@subscription_bp.route('/subscriptions/current/cancel', methods=['POST'])
@swag_from({
    'summary': 'Cancel the current active subscription for the authenticated user',
    'responses': {
        200: {'description': 'Subscription cancelled successfully'},
        401: {'description': 'Unauthorized'},
        422: {'description': 'Unprocessable entity'},
        500: {'description': 'Internal server error'}
    }
})
@role_required(['user'])
@handle_errors
def cancel_current_subscription():
    user_id = request.current_user.user_id
    return SubscriptionService.cancel_current_subscription(user_id)


@subscription_bp.route('/user_subscriptions/user', methods=['GET'])
@swag_from({
    'summary': 'Get all subscriptions for a specific user (admin only)',
    'parameters': [
        {
            'name': 'user',
            'in': 'query',
            'required': True,
            'type': 'string',
            'description': 'User ID to retrieve subscriptions for'
        }
    ],
    'responses': {
        200: {
            'description': 'List of subscriptions for the user',
            'schema': {
                'type': 'object',
                'properties': {
                    'subscriptions': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'subscription_id': {'type': 'string'},
                                'user_id': {'type': 'string'},
                                'plan': {
                                    'type': 'object',
                                    'properties': {
                                        'plan_id': {'type': 'string'},
                                        'name': {'type': 'string'},
                                        'price': {'type': 'number'},
                                        'duration_days': {'type': 'integer'}
                                    }
                                },
                                'start_date': {'type': 'string'},
                                'end_date': {'type': 'string'},
                                'is_active': {'type': 'boolean'}
                            }
                        }
                    }
                }
            }
        },
        400: {'description': 'Validation error'},
        401: {'description': 'Unauthorized'},
        422: {'description': 'Unprocessable entity'},
        500: {'description': 'Internal server error'}
    }
})
@role_required(['admin'])
@handle_errors
def get_user_subscriptions_admin():
    user_id = request.args.get('user')
    if not user_id:
        raise ValidationError("User ID is required.")
    return SubscriptionService.get_user_subscriptions(user_id)


@subscription_bp.route('/cancel_current_user_subscription/user', methods=['PUT'])
@swag_from({
    'summary': 'Cancel the current subscription for a specific user (admin only)',
    'parameters': [
        {
            'name': 'user',
            'in': 'query',
            'required': True,
            'type': 'string',
            'description': 'User ID to cancel subscription for'
        }
    ],
    'responses': {
        200: {'description': 'Subscription cancelled successfully'},
        400: {'description': 'Validation error'},
        401: {'description': 'Unauthorized'},
        422: {'description': 'Unprocessable entity'},
        500: {'description': 'Internal server error'}
    }
})
@role_required(['admin'])
@handle_errors
def cancel_current_user_subscription_admin():
    user_id = request.args.get('user')
    if not user_id:
        raise ValidationError("User ID is required.")
    return SubscriptionService.cancel_current_subscription(user_id)
