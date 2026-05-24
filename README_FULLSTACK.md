
# Lamp Store Fullstack

Это самодостаточная версия проекта: backend, frontend и база запускаются из одного репозитория через Docker Compose.

## Структура

```text
artemov_lamp_store_microservices
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   ├── public
│   └── src
├── infra
│   └── postgres
└── services
    ├── product_service
    └── order_service
```

## Запуск

```bash
docker compose up --build
```

После запуска:

- Frontend: http://localhost:5173
- Product API docs: http://localhost:8001/docs
- Order API docs: http://localhost:8002/docs
- PostgreSQL: localhost:5432

## Добавить тестовые товары

Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\seed-products.ps1
```

После этого обновите страницу каталога.

## Важно

Если раньше вы добавляли товары из старого локального frontend-массива, очистите корзину в браузере:

```js
localStorage.clear()
```
