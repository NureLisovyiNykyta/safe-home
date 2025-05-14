from app import db
from sqlalchemy.sql import func
import uuid

class Sensor(db.Model):
    __tablename__ = 'sensor'

    sensor_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    home_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey('home.home_id', ondelete='CASCADE'),
        nullable=False
    )
    user_id = db.Column(db.UUID(as_uuid=True), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    is_closed = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=False)
    is_security_breached = db.Column(db.Boolean, default=False)
    is_archived = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    home = db.relationship('Home', back_populates='sensors')
    