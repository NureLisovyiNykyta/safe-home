import random
from faker import Faker
from app import db
from app.services.user_service import UserService
from app.services.subscription_service import SubscriptionService
from app.services.home_service import HomeService
from app.services.sensor_service import SensorService
from app.repositories.home_repo import HomeRepository
from app.repositories.sensor_repo import SensorRepository
from app.models.user import User

fake = Faker()

SENSORS_TYPES = ["door", "window", "motion", "camera"]

def create_user_with_data(i):
    # --- Generate user ---
    name = fake.name()
    email = f"test_user_{i}@example.com"
    password = "password123"

    user_data = {
        "name": name,
        "email": email,
        "password": password
    }

    # Register user using your service
    user = UserService.register_user(user_data, role_name="user")

    # Confirm email
    user.email_confirmed = True
    db.session.commit()

    # Assign basic subscription
    SubscriptionService.create_basic_subscription(user.user_id)

    print(f"[OK] User created: {email}")
    return user


def create_home(user_id, name, archived=False):
    home_body = {
        "name": name,
        "address": fake.address()
    }

    # Use service to create home
    HomeService.add_home(user_id, home_body)

    # Fetch created home (latest by user)
    home = HomeRepository.get_last_created_home(user_id)

    # If archived — patch manually
    if archived:
        home.is_archived = True
        db.session.commit()

    print(f"  [OK] Home created: {name} (archived={archived})")
    return home


def create_sensors(user_id, home, archived=False):
    for i in range(4):
        sensor_body = {
            "home_id": str(home.home_id),
            "name": f"Sensor {i+1}",
            "type": random.choice(SENSORS_TYPES)
        }

        # Add via service (works only for non-archived homes)
        if not archived:
            SensorService.add_sensor(user_id, sensor_body)
            sensor = SensorRepository.get_last_created_sensor(user_id)
            sensor.is_active = True
            db.session.commit()
        else:
            # For archived homes, add manually (service prohibits)
            from app.models.sensor import Sensor
            sensor = Sensor(
                home_id=home.home_id,
                user_id=user_id,
                name=sensor_body["name"],
                type=sensor_body["type"],
                is_archived=True,
                is_active=False
            )
            SensorRepository.add(sensor)

        print(f"    [OK] Sensor created (archived={archived})")


def generate():
    print("=== Generating 100 test users ===")

    for i in range(1, 101):
        try:
            print(f"\nCreating user #{i}")

            user = create_user_with_data(i)

            # Active home
            active_home = create_home(user.user_id, "Active Home", archived=False)
            create_sensors(user.user_id, active_home, archived=False)

            # Archived home
            archived_home = create_home(user.user_id, "Archived Home", archived=True)
            create_sensors(user.user_id, archived_home, archived=True)

        except Exception as e:
            print(f"[ERROR] User #{i} failed: {e}")
            db.session.rollback()
