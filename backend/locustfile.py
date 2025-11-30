from locust import HttpUser, task, between

TEST_USERS_COUNT = 100
TEST_PASSWORD = "password123"


class UserFlow(HttpUser):
    wait_time = between(0.5, 1.5)

    def on_start(self):
        self.user_index = (self.environment.runner.user_count % TEST_USERS_COUNT) + 1
        self.email = f"test_user_{self.user_index}@example.com"
        self.login()

    def login(self):
        with self.client.post(
            "/api/login/session",
            json={
                "email": self.email,
                "password": TEST_PASSWORD
            },
            name="POST /api/login/session",
            catch_response=True
        ) as response:
            if response.status_code != 200:
                response.failure("Login failed")

    @task
    def read_user_data(self):

        with self.client.get(
            "/api/user",
            name="GET /api/user",
            catch_response=True
        ) as r:
            if r.status_code != 200:
                r.failure("/api/user failed")
                return

        with self.client.get(
            "/api/homes",
            name="GET /api/homes",
            catch_response=True
        ) as r:
            if r.status_code != 200:
                r.failure("/api/homes failed")
                return
            homes = r.json().get("homes", [])

        for home in homes:
            self.client.get(
                f"/api/sensors/{home['home_id']}",
                name="GET /api/sensors/:home_id"
            )
