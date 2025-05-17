from .home_sockets import setup_home_sockets
from .sensor_sockets import setup_sensor_sockets

def init_sockets(socketio):
    setup_home_sockets(socketio)
    setup_sensor_sockets(socketio)