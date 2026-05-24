# Lamp Store Microservices

Готовый backend-каркас по ТЗ: микросервис товаров и микросервис заказов c аутентификации и авторизации. Операции, которые в доступны из панели управления.

## Стек

- Python 3.14
- FastAPI
- SQLAlchemy 2.x async
- Pydantic v2
- Alembic
- PostgreSQL
- Docker Compose

## Запуск

```bash
docker compose up --build
```

- Product Service: http://localhost:8001/docs
- Order Service: http://localhost:8002/docs
- PostgreSQL: localhost:5432

## Примеры запросов

```bash
curl -X POST http://localhost:8001/api/products \
  -H 'Content-Type: application/json' \
  -d '{"title":"Лампа LED E27","price":199.90,"brightness":800,"stock":10}'
```

```bash
curl -X POST http://localhost:8002/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"email":"client@example.com","phone":"+79990000000","items":[{"product_id":"<UUID>","quantity":2}]}'
```
