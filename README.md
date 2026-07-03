# User Management Dashboard

A full-stack web application for managing users with **NestJS** (backend) and **React** (frontend). The backend proxies requests to [JSONPlaceholder](https://jsonplaceholder.typicode.com/) while maintaining an in-memory store so CRUD operations persist during the session.

## Features

- **View** users with ID, First Name, Last Name, Email, and Department
- **Add**, **Edit**, and **Delete** users
- **Pagination** with 10, 25, 50, and 100 row limits
- **Filter popup** by first name, last name, email, and department
- **Search** across all user fields
- **Sort** by any column (ascending/descending)
- **Responsive** layout (table on desktop, cards on mobile)
- **Error handling** for API failures
- **Client-side validation** on user forms

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | NestJS, Axios, class-validator      |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Axios |
| API      | JSONPlaceholder `/users` endpoint   |

## Project Structure

```
├── backend/          # NestJS API server
│   └── src/users/    # Users module (controller, service, DTOs)
├── frontend/         # React SPA
│   └── src/
│       ├── api/      # HTTP client
│       ├── components/
│       ├── types/
│       └── utils/
└── README.md
```

## Prerequisites

- Node.js 18+ and npm

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

The API runs at **http://localhost:3000**.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**. API requests are proxied to the backend via Vite.

## API Endpoints

| Method | Endpoint     | Description              |
|--------|--------------|--------------------------|
| GET    | `/users`     | List users (paginated, searchable, sortable, filterable) |
| GET    | `/users/:id` | Get a single user        |
| POST   | `/users`     | Create a user            |
| PUT    | `/users/:id` | Update a user            |
| DELETE | `/users/:id` | Delete a user            |

### Query Parameters (GET /users)

| Param       | Description                          |
|-------------|--------------------------------------|
| `page`      | Page number (default: 1)             |
| `limit`     | Rows per page: 10, 25, 50, 100       |
| `search`    | Global search term                   |
| `sortBy`    | Column to sort by                    |
| `sortOrder` | `asc` or `desc`                      |
| `firstName` | Filter by first name                 |
| `lastName`  | Filter by last name                  |
| `email`     | Filter by email                      |
| `department`| Filter by department                 |

## Assumptions

1. **JSONPlaceholder data mapping**: JSONPlaceholder returns a single `name` field and `company.name`. The backend splits `name` into `firstName` and `lastName`, and maps `company.name` to `department`.
2. **In-memory persistence**: JSONPlaceholder does not persist POST/PUT/DELETE. The NestJS backend calls the external API for each mutation (as required) and then updates an in-memory store so changes are visible during the session. Data resets when the server restarts.
3. **NestJS as API layer**: The React frontend talks to the NestJS backend (not directly to JSONPlaceholder), providing validation, error handling, and a consistent data shape.

## Challenges & Future Improvements

### Challenges Faced

- JSONPlaceholder's user schema differs from the assignment requirements (no separate first/last name or department fields), requiring a mapping layer.
- Since JSONPlaceholder doesn't persist mutations, balancing the requirement to "use the API" with a functional demo required an in-memory overlay on the backend.
- Implementing search, sort, filter, and pagination together while keeping the UI responsive required careful state management.

### Improvements With More Time

- Add unit and e2e tests for both backend and frontend
- Persist data to a local database (SQLite/PostgreSQL) instead of in-memory storage
- Add loading skeletons and optimistic UI updates
- Implement infinite scrolling as an alternative to pagination
- Add authentication and role-based access control
- Dockerize the application for one-command deployment
- Add CI/CD pipeline with linting and automated tests

## License

MIT
