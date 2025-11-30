from app import db
from sqlalchemy.sql import func
import uuid

class SensorHealthLog(db.Model):
    __tablename__ = 'sensor_health_log'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sensor_id = db.Column(db.UUID(as_uuid=True), nullable=False)
    battery_level = db.Column(db.Integer, nullable=False)
    signal_strength = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
