from locust import HttpUser, task, between

ADMIN_EMAIL = "admin@safehome.com"
ADMIN_PASSWORD = "12345678"


class AdminUser(HttpUser):
    wait_time = between(0.5, 1.5)

    def on_start(self):
        self.login()

    def login(self):
        with self.client.post(
            "/api/login/session",
            json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            },
            name="POST /api/login/session (admin)",
            catch_response=True
        ) as response:
            if response.status_code != 200:
                response.failure("Admin login failed")

    @task
    def get_all_users(self):
        with self.client.get(
            "/api/users",
            name="GET /api/users",
            catch_response=True
        ) as response:
            if response.status_code != 200:
                response.failure("Failed to get users")
