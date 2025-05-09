# Используем официальный образ Node.js для сборки
FROM node:22 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем остальной код приложения
COPY . .

# Собираем приложение для продакшена
RUN npm run build

# Финальный этап — копируем только собранные файлы
FROM scratch AS export
COPY --from=build /app/build /build