
# Лид.ру

Лид.ру — это веб-приложение для поиска работы и подбора сотрудников.

Проект объединяет три сценария в одном интерфейсе:

- **кандидат** — просмотр вакансий, отклики, избранное, профиль
- **работодатель** — создание вакансий, просмотр кандидатов, работа со статусами
- **администратор** — модерация и контроль публикаций

Проект запускается через **Docker Compose** одной командой и не требует ручной настройки фронта, бэкенда, базы данных и прокси по отдельности.

---

## Что внутри

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Go
- Gin
- GORM
- JWT-аутентификация

### Инфраструктура
- MySQL
- Redis
- Nginx
- Docker Compose

---

## Что умеет проект

### Для кандидата
- смотреть список вакансий
- открывать страницу вакансии
- видеть соответствие вакансии профилю
- добавлять вакансии в избранное
- отправлять отклики
- смотреть свои отклики
- редактировать профиль

### Для работодателя
- создавать вакансии
- просматривать свои вакансии
- видеть отклики кандидатов
- менять статусы кандидатов

### Для администратора
- смотреть список вакансий
- модерировать и контролировать публикации

---

## Быстрый старт

### Требования
Нужно только:
- Docker
- Docker Compose
- Git

---

## Запуск проекта

## Клонирование репозитория

Склонируй проект себе на компьютер:

```bash
git clone https://github.com/HawHack/Lid.ru.git
cd Lid.ru
```

Из корня проекта выполни:

```bash
docker compose down -v
docker compose up --build
````

После первого запуска будут автоматически подняты:

* MySQL
* Redis
* backend API
* frontend через nginx

---

## Куда открывать

После запуска приложение доступно по адресу:

```text
http://localhost:3000
```

Проверка backend API:

```text
http://localhost:3000/health
```

Если всё работает, этот адрес должен вернуть:

```json
{"status":"ok"}
```

---

## Тестовые аккаунты

Если используется актуальный `01-seed.sql`, после запуска доступны такие аккаунты:

### Администратор

* `admin@lid.ru`
* пароль: `password123`

### Кандидаты

* `candidate@test.com`
* `candidate2@test.com`
* `candidate3@test.com`
* `candidate4@test.com`
* пароль: `password123`

### Работодатели

* `employer@test.com`
* `employer2@test.com`
* `employer3@test.com`
* пароль: `password123`

---

## Как устроен запуск

Проект запускается через **единый корневой** `docker-compose.yml`.

Схема такая:

* **frontend** собирается в production-режиме
* **nginx** отдаёт собранный frontend
* запросы к API идут через **same-origin proxy**
* **backend** работает внутри docker-сети
* **MySQL** инициализируется через:

  * `00-schema.sql`
  * `01-seed.sql`

То есть браузер работает только с одним адресом:

```text
http://localhost:3000
```

Отдельно указывать `VITE_API_URL=http://localhost:8080` для docker-запуска **не нужно**.

---

## Структура проекта

```text
.
├── docker-compose.yml
├── README.md
├── back/
│   └── backend/
│       ├── cmd/
│       ├── docs/
│       ├── internal/
│       └── mysql-init/
└── frontend/
    ├── public/
    ├── src/
    ├── Dockerfile
    ├── nginx.conf
    └── package.json
```

---

## Основные директории

### Backend

* `back/backend/cmd/api` — точка входа backend
* `back/backend/internal` — бизнес-логика, handlers, services, repositories
* `back/backend/mysql-init` — SQL-схема и стартовые данные

### Frontend

* `frontend/src/app` — router и store
* `frontend/src/features` — экраны и сценарии
* `frontend/src/entities` — сущности и API
* `frontend/src/shared` — общие UI-компоненты, конфиг, api-клиент
* `frontend/nginx.conf` — nginx-конфиг для SPA и proxy до backend

---

## Перезапуск с чистой базой

Если нужно полностью пересоздать базу данных и заново применить seed:

```bash
docker compose down -v
docker compose up --build
```

Важно: команда с `-v` удаляет volume MySQL.
Это значит, что все данные из базы будут созданы заново из `00-schema.sql` и `01-seed.sql`.

---

## Полезные команды

### Остановить проект

```bash
docker compose down
```

### Остановить и удалить volume базы

```bash
docker compose down -v
```

### Пересобрать только frontend

```bash
docker compose build frontend
docker compose up -d frontend
```

### Пересобрать только backend

```bash
docker compose build api
docker compose up -d api
```

### Посмотреть логи

```bash
docker compose logs -f
```

### Посмотреть логи конкретного сервиса

```bash
docker compose logs -f frontend
docker compose logs -f api
docker compose logs -f mysql
```

---

## Swagger

Если swagger включён и backend поднят, документация доступна по адресу:

```text
http://localhost:3000/swagger/index.html
```

---

## Если что-то не работает

### 1. Приложение не открывается

Проверь:

```bash
docker compose ps
```

И затем:

```bash
docker compose logs -f
```

---

### 2. Логин не работает

Сначала проверь здоровье API:

```text
http://localhost:3000/health
```

Потом убедись, что используешь актуальные логины из `01-seed.sql`.

Если база пересоздавалась, старые вручную созданные пользователи исчезают.

---

### 3. После изменений фронта ничего не поменялось

Пересобери frontend:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```

---

### 4. Проблемы с кодировкой русского текста

Убедись, что SQL-файлы сохранены в UTF-8, и пересоздай базу:

```bash
docker compose down -v
docker compose up --build
```

---

## Разработка

Если ты меняешь seed, docker-конфиг или backend-контракты, лучше проверять проект только через корневой запуск:

```bash
docker compose up --build
```

Это основной и поддерживаемый способ старта проекта.

---

## Что должно быть в репозитории

В репозитории должны лежать:

* исходники frontend
* исходники backend
* корневой `docker-compose.yml`
* `README.md`
* `mysql-init/00-schema.sql`
* `mysql-init/01-seed.sql`
* docker-файлы и nginx-конфиг

Не нужно хранить:

* `frontend/dist`
* локальные дампы проекта
* временные файлы
* старые неиспользуемые docker-compose файлы, если основной запуск уже переведён на корневой compose

---

## Назначение проекта

Лид.ру — это учебный и портфельный fullstack-проект, который показывает:

* работу с ролями пользователей
* авторизацию через JWT
* взаимодействие frontend и backend
* работу с MySQL
* запуск полного приложения через Docker
* проксирование frontend ↔ backend через nginx




