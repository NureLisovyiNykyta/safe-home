**Backend Setup**

Make sure to include the following files before running the application:
.env – contains environment variables
google-services.json – required for authentication services

Run with Python

python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
flask run

Run with Dockerfile

docker build -t safe_home_backend .
docker run -p 5000:5000 --env-file .env -v $(pwd)/google-services.json:/google-services.json safe_home_backend

