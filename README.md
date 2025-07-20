# 🎓 AI-Driven Learning Platform

## 🧠 Overview

This project is a mini learning platform that leverages Artificial Intelligence to provide personalized lessons based on user-selected topics and prompts. Users can register, log in, choose categories and sub-categories, submit learning prompts to an AI model, receive generated lessons, and review their learning history. An Admin Dashboard is also included for user and prompt history management.

The platform is built with a focus on modular architecture, security, robust error handling, and maintainability.

---

## ✨ Features

### 🔧 Backend
- RESTful API: Structured and well-defined endpoints.
- PostgreSQL + Prisma: Efficient data management and ORM.
- OpenAI GPT: Lesson generation via GPT models.
- JWT Authentication: Secure access control.
- Role-based Authorization: User/Admin access levels.
- Input Validation: Zod schemas for robust data validation.
- Centralized Error Handling: Consistent API error responses.
- Security: Helmet for HTTP header security, rate limiting to prevent abuse.
- Logging: Winston for debugging and monitoring.
- Full TypeScript Support: Enhanced code quality and maintainability.
- Swagger/OpenAPI Documentation: Interactive API docs at `/api-docs`.

### 💻 Frontend
- Authentication: User registration and login flows.
- Category & Sub-Category Selection: Intuitive interface for choosing learning topics.
- Prompt Submission Interface: Easy way to submit learning requests to the AI.
- AI Lesson Display: Clear presentation of AI-generated responses.
- Learning History Tracking: Users can view their past lessons.

### 🛠️ Admin Dashboard
- User list and detailed prompt history for any user.
- User role management.
- User deletion and profile updates.
- Pagination and filtering for efficient data navigation.

---

## 🛠️ Technologies Used

### Backend:
- Node.js (TypeScript)
- Express.js
- PostgreSQL
- Prisma (ORM)
- OpenAI GPT API
- JWT, Bcrypt
- Helmet, Express Rate Limit
- Zod
- Winston
- Swagger UI Express, YAMLJS

### Frontend:
- React (TypeScript)
- Redux Toolkit
- Tailwind CSS
- React Hook Form
- Lucide Icons
- Axios

### DevOps & Tooling:
- Docker, Docker Compose
- ESLint, Prettier
- Git, GitHub

---

## 🧱 Architecture

The platform follows a classic client-server architecture with clear separation of concerns:

```
Client (React)
   |
REST API (Express.js)
   |
Middleware (Authentication, Validation, Error Handling)
   |
Controllers -> Services -> Prisma (ORM) -> PostgreSQL (Database)
   |
OpenAI API (accessed via a dedicated prompt service)
```

Frontend: A React application consumes the RESTful API.  
Backend: An Express.js server built with TypeScript handles all business logic.  
Database Interaction: Prisma ORM manages interactions with PostgreSQL.  
AI Integration: OpenAI API is called through a dedicated service layer.  
Validation: Zod schemas are used extensively for input validation.  
Layered Separation: Backend organized into Routes, Controllers, Services, Database access.

---

## 🚀 Setup Instructions

### ✅ Prerequisites
- Node.js (v18+)
- npm or Yarn
- Docker and Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/TziviZl/AI-Learning-Platform.git
cd AI-Learning-Platform
```

### 2. Environment Variables

#### Root `.env`
```env
DB_NAME=learning_platform_db
DB_USER=lp_user
DB_PASSWORD=lp_password
JWT_SECRET=your_super_secret_jwt_key_here_for_prod
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```

#### `backend/.env`
```env
DATABASE_URL="postgresql://lp_user:lp_password@db:5432/learning_platform_db?schema=public"
PORT=10000
JWT_SECRET=your_super_secret_jwt_key_here_for_prod
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
NODE_ENV=development
BACKEND_URL=http://localhost:5000
```

#### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 4. Make Entrypoint Executable
```bash
chmod +x backend/docker-entrypoint.sh
```

### 5. Run with Docker Compose
```bash
docker-compose up -d --build
```

This will:
- Build images
- Start PostgreSQL
- Run Prisma migrations and seeds
- Start backend and frontend

---

## 🌐 Access Points

| Service          | URL                                                                 |
|------------------|----------------------------------------------------------------------|
| 🛢️ Database       | `localhost:5432`                                                   |
| 🔙 Backend API    | http://localhost:5000                                                |
| 📘 Swagger UI     | http://localhost:5000/api-docs                                       |
| 💻 Frontend App   | http://localhost:5173                                                |

---

## ☁️ Live Deployment (Render)

| Service          | URL                                                                 |
|------------------|----------------------------------------------------------------------|
| 🔙 Backend API    | https://ai-learning-platform-okxq.onrender.com                      |
| 📘 Swagger UI     | https://ai-learning-platform-okxq.onrender.com/api-docs            |
| 💻 Frontend App   | https://ai-learning-platform-1-7kpk.onrender.com                   |

---

## 📘 API Endpoints

| Endpoint                         | Method | Auth  | Description                           |
|----------------------------------|--------|-------|---------------------------------------|
| `/auth/register`                | POST   | None  | Register a new user                   |
| `/auth/login`                   | POST   | None  | Log in an existing user               |
| `/users/me`                     | PATCH  | User  | Update authenticated user's profile   |
| `/users/:id/prompts`           | GET    | User  | Get user's learning history           |
| `/categories`                   | GET    | None  | List all categories                   |
| `/categories/:id/sub-categories`| GET   | None  | Get sub-categories by category        |
| `/prompts`                      | POST   | User  | Submit a new learning prompt          |
| `/admin/users`                  | GET    | Admin | List all users                        |
| `/admin/users/:id/prompts`     | GET    | Admin | Get all prompts for a specific user   |
| `/admin/users/:id`             | PATCH  | Admin | Update user profile by ID             |
| `/admin/users/:id`             | DELETE | Admin | Delete user by ID                     |

---

## 🧠 Assumptions

- Israeli phone format (10 digits starting with 05)
- Two roles: USER and ADMIN
- `VITE_API_URL`: http://localhost:5000/api
- Backend internal port: 10000
- Environment variable consistency is required

---

## 🧪 Troubleshooting

### ❌ Can't connect to Database
```bash
docker-compose ps
docker-compose logs db
docker-compose down -v
docker-compose up -d --build
```

### ❌ 401 / 403 Errors
- Check token in Authorization header
- Validate JWT_SECRET
- Confirm user role

### ❌ Validation Errors
- Check `details` field in API response
- Match input to Zod schemas

### ❌ Frontend can't reach Backend
- Confirm `VITE_API_URL`
- Open DevTools → Network tab
- Run `docker-compose logs backend`

---

## 📞 Contact 
📧 Tzivi9763@gmail.com  
For bug reports, questions, or feedback.


