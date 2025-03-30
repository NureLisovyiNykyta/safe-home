from flask import Blueprint, request
from app.models import Home, Sensor, DefaultSecurityMode
from app.utils.auth_decorator import role_required

security_bp = Blueprint('security', __name__)


@security_bp.route('/user_homes', methods=['Get'])
@role_required(['user']) 
def get_user_homes():
    user = request.current_user
    return Home.get_all_homes(user.user_id)


@security_bp.route('/add_user_home', methods=['Post'])
@role_required(['user']) 
def add_user_home():
    user = request.current_user
    data = request.get_json()
    return Home.add_home(user.user_id, data)


@security_bp.route('/delete_user_home/home', methods=['Post'])
@role_required(['user']) 
def delete_user_home():
    user = request.current_user
    home_id = request.args.get('home')
    return Home.delete_home(user.user_id, home_id)


@security_bp.route('/home_sensors/home', methods=['Get'])
@role_required(['user']) 
def get_home_sensors():
    home_id = request.args.get('home')
    return Sensor.get_all_sensors(home_id)


@security_bp.route('/add_home_sensor', methods=['Post'])
@role_required(['user']) 
def add_home_sensor():
    user = request.current_user
    data = request.get_json()
    return Sensor.add_sensor(user.user_id, data)


@security_bp.route('/delete_home_sensor/sensor', methods=['Post'])
@role_required(['user']) 
def delete_home_sensor():
    user = request.current_user
    sensor_id = request.args.get('sensor')
    return Sensor.delete_sensor(user.user_id, sensor_id)


@security_bp.route('/turn_on_sensor/sensor', methods=['Put'])
@role_required(['user']) 
def turn_on_sensor():
    user = request.current_user
    sensor_id = request.args.get('sensor')
    return Sensor.set_sensor_activity(user.user_id, sensor_id, True)


@security_bp.route('/turn_off_sensor/sensor', methods=['Put'])
@role_required(['user'])
def turn_off_sensor():
    user = request.current_user
    sensor_id = request.args.get('sensor')
    return Sensor.set_sensor_activity(user.user_id, sensor_id, False)


@security_bp.route('/default_security_modes', methods=['Get'])
@role_required(['user']) 
def get_default_security_modes():
    return DefaultSecurityMode.get_all_default_modes()


@security_bp.route('/set_disarmed_security_mode/home', methods=['Put'])
@role_required(['user'])
def set_disarmed_security_mode():
    user = request.current_user
    home_id = request.args.get('home')
    return Home.set_disarmed_security_mode(user.user_id, home_id)


@security_bp.route('/set_armed_security_mode/home', methods=['Put'])
@role_required(['user'])
def set_armed_security_mode():
    user = request.current_user
    home_id = request.args.get('home')
    return Home.set_armed_security_mode(user.user_id, home_id)


@security_bp.route('/archive_home_sensors/home', methods=['Put'])
@role_required(['user']) 
def archive_home_sensors():
    user = request.current_user
    home_id = request.args.get('home')
    return Home.archive_home_sensors(user.user_id, home_id)


@security_bp.route('/unarchive_home/home', methods=['Put'])
@role_required(['user']) 
def unarchive_home():
    user = request.current_user
    home_id = request.args.get('home')
    return Home.unarchive_home(user.user_id, home_id)


@security_bp.route('/archive_sensor/sensor', methods=['Put'])
@role_required(['user']) 
def archive_sensor():
    user = request.current_user
    sensor_id = request.args.get('sensor')
    return Sensor.archive_sensor(user.user_id, sensor_id)


@security_bp.route('/unarchive_sensor/sensor', methods=['Put'])
@role_required(['user']) 
def unarchive_sensor():
    user = request.current_user
    sensor_id = request.args.get('sensor')
    return Sensor.unarchive_sensor(user.user_id, sensor_id)
