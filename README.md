# DevPulse - Internal Tech Issue & Feature Tracker

DevPulse is a small backend API where software teams can report bugs, suggest
features, and track how they get resolved. Think of it as a lightweight issue
tracker that a team could run internally.

This project is built with **Node.js, TypeScript, Express, and PostgreSQL**, using
**raw SQL queries** (no ORM) through the native `pg` driver.

---

## Tech Stack

| Tool             | Why it's used                              |
| ---------------- | ------------------------------------------ |
| **Node.js**      | JavaScript runtime                         |
| **TypeScript**   | Type safety and cleaner code               |
| **Express.js**   | Web framework with modular routing         |
| **PostgreSQL**   | Relational database                        |
| **pg**           | Native PostgreSQL driver (raw SQL)         |
| **bcryptjs**     | Password hashing                           |
| **jsonwebtoken** | Creating and verifying JWT tokens          |
| **dotenv**       | Loading environment variables              |
| **tsup**         | Bundling TypeScript for production         |
| **tsx**          | Running TypeScript directly in development |

---

## Project Structure

```
src/
├── auth/                 # Signup & login (routes, controller, service)
├── issues/               # Issue CRUD (routes, controller, service)
├── middleware/           # Auth guard, logger, global error handler
├── config/               # Environment config
├── db/                   # PostgreSQL pool + table setup
├── utils/                # Reusable helpers (JWT, AppError, sendResponse)
├── types/                # Shared TypeScript types
├── app.ts                # Express app setup
└── server.ts             # App entry point
```

---

### Run the project

```bash
# development (auto-reloads on file changes)
npm run dev

# production build + start
npm run build
npm start
```

When the server starts, it automatically creates the `users` and `issues`
tables if they don't exist. You should see:

```
database successfully connected!
Server running on http://localhost:5000
```

---

## Authentication

Protected routes need a JWT token. After logging in, send the token in the
request header like this:

```
Authorization: <your_jwt_token>
```

> Note: this API uses the raw token (no `Bearer` prefix).

---

## API Endpoints

Base path: `/api`

### Auth

| Method | Endpoint       | Access | Description            |
| ------ | -------------- | ------ | ---------------------- |
| POST   | `/auth/signup` | Public | Register a new user    |
| POST   | `/auth/login`  | Public | Log in and get a token |

### Issues

| Method | Endpoint      | Access                                      | Description                  |
| ------ | ------------- | ------------------------------------------- | ---------------------------- |
| POST   | `/issues`     | Authenticated                               | Create a new issue           |
| GET    | `/issues`     | Public                                      | Get all issues (filter/sort) |
| GET    | `/issues/:id` | Public                                      | Get a single issue           |
| PATCH  | `/issues/:id` | Maintainer (any) / Contributor (own & open) | Update an issue              |
| DELETE | `/issues/:id` | Maintainer only                             | Delete an issue              |

**Query parameters for `GET /issues`:**

| Param    | Values                            | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | (none)   |
| `status` | `open`, `in_progress`, `resolved` | (none)   |

Example: `GET /api/issues?sort=oldest&type=bug&status=open`

---

## Example Requests

### Register

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

### Create an issue

```http
POST /api/issues
Authorization: <your_jwt_token>
Content-Type: application/json

{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

---

## Response Format

Every response follows a consistent shape.

**Success:**

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Author

**kamruj-akash**

Built as part of the Next Level Programming (B7) assignment series.
