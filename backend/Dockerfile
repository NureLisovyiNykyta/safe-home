# Используем официальный образ Python
FROM python:3.11

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все файлы проекта
COPY . .

# Открываем порт 5000
EXPOSE 5000

# Запускаем приложение через Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:flask_app"]
