# Gym Management System — ITSS Group 15 (2025.2)

A comprehensive gym management system supporting four user roles (Owner, Manager, Trainer/PT, and Member) with a modern web interface and RESTful API architecture.

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Features](#features)
* [Database](#database)
* [API Endpoints](#api-endpoints)
* [Installation & Setup](#installation--setup)
* [Environment Variables](#environment-variables)
* [System Architecture](#system-architecture)
* [Team Members](#team-members)

---

## Overview

The system provides a complete set of business operations for a gym management environment:

* Member management, membership packages, subscriptions, and invoicing
* Personal training session booking with Personal Trainers (PTs)
* Employee, facility, and equipment management
* Revenue reporting and performance analytics
* Real-time notifications using Server-Sent Events (SSE)
* Password reset via Gmail SMTP

---

## Tech Stack

### Backend

| Component        | Technology                           |
| ---------------- | ------------------------------------ |
| Language         | Go 1.25.3                            |
| HTTP Router      | Gorilla Mux v1.8.1                   |
| Database         | PostgreSQL                           |
| Database Driver  | `github.com/lib/pq`                  |
| Authentication   | JWT (`github.com/golang-jwt/jwt/v5`) |
| Password Hashing | Bcrypt (`golang.org/x/crypto`)       |
| Configuration    | Godotenv                             |
| Email Service    | Gmail SMTP                           |

### Frontend

| Component      | Technology                     |
| -------------- | ------------------------------ |
| Framework      | React 19.2                     |
| Build Tool     | Vite 8.0                       |
| Routing        | React Router v7                |
| Styling        | Tailwind CSS 4.2 (Dark Mode)   |
| Server State   | TanStack React Query 5.94      |
| Client State   | Zustand 5.0                    |
| Forms          | React Hook Form 7.72 + Zod 4.3 |
| HTTP Client    | Axios 1.13                     |
| Animation      | Framer Motion 12.40            |
| Charts         | Recharts 3.8                   |
| Icons          | Lucide React 0.577             |
| Notifications  | Sonner 2.0                     |
| Date Utilities | date-fns 4.1                   |

---

## Project Structure

```text
ITSS-Group15-2025.2/
├── backend/
│   ├── db/                              # SQL migrations & seed data
│   │   ├── 01_create_tables.sql         # Defines 16 tables
│   │   ├── 02_constraints_indexes.sql   # Constraints & indexes
│   │   ├── 03_functions_triggers.sql    # PostgreSQL functions & triggers
│   │   └── 04_seed_data.sql             # Initial seed data
│   └── go/                              # Go application
│       ├── cmd/app/main.go              # Entry point, DI initialization
│       ├── go.mod / go.sum
│       ├── .env                         # Environment configuration
│       ├── internal/
│       │   ├── domain/
│       │   │   ├── entity/              # 14 entity types (structs)
│       │   │   ├── adapter/             # DTO adapters (request/response)
│       │   │   └── usecase/             # Business logic (16 packages)
│       │   ├── infra/
│       │   │   ├── api/
│       │   │   │   ├── handlers/        # HTTP handlers (18+ files)
│       │   │   │   ├── routes/          # 200+ route definitions
│       │   │   │   └── middleware/      # Auth, Logging, Recovery, CORS
│       │   │   ├── postgresql/          # DB connection
│       │   │   ├── email/               # Gmail SMTP service
│       │   │   └── notification/        # In-memory SSE hub
│       │   └── repository/              # Data access layer (15 repos)
│       ├── tools/seeder/                # Seed data generators
│       │   ├── seed_roles_accounts/
│       │   ├── seed_employees_pt/
│       │   ├── seed_members/
│       │   ├── seed_service_packages/
│       │   ├── seed_facilities_equipment/
│       │   ├── seed_subscriptions_invoices/
│       │   ├── seed_training/
│       │   └── seed_feedback/
│       ├── uploads/avatars/             # Avatar storage
│       └── docs/                        # API documentation
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env / .env.example
    └── src/
        ├── main.jsx / App.jsx           # React entry point
        ├── routes/
        │   ├── index.jsx                # 200+ route definitions
        │   ├── PrivateRoute.jsx         # Protects routes requiring login
        │   └── RoleBasedRoute.jsx       # Role-based access control
        ├── pages/                       # 74 page components
        │   ├── Login/                   # Login, forgot password
        │   ├── Owner/                   # Dashboard & system-wide management
        │   ├── Manager/                 # Dashboard & daily management
        │   ├── Trainer/                 # PT Portal
        │   └── Member/                  # Member Portal
        ├── components/                  # Reusable UI components
        │   ├── Charts/                  # Data charts
        │   ├── Dashboard/               # Dashboard layouts
        │   ├── Forms/                   # Form components
        │   ├── Layout/                  # MainLayout, TrainerLayout
        │   └── Common/                  # Shared components
        ├── hooks/
        │   ├── mutations/               # 12+ useMutation hooks
        │   └── queries/                 # 14+ useQuery hooks
        ├── store/                       # Zustand stores
        │   ├── useAuthStore.js          # Authentication state
        │   ├── useThemeStore.js         # Dark/Light mode
        │   ├── useTrainerStore.js       # Trainer state
        │   └── useUIStore.js            # General UI state
        ├── services/                    # API service layer (Axios)
        ├── schemas/                     # Zod validation schemas
        ├── utils/                       # Utility functions
        └── lib/                         # queryClient, global configs
## Features

### Authentication & Authorization

* User authentication using username/password with JWT tokens (15-minute access token + 168-hour refresh token)
* Four user roles: **OWNER**, **MANAGER**, **PT (Trainer)**, and **MEMBER**
* Password reset via email using Gmail SMTP
* First-login flag requiring users to change their password upon initial login

### Member Management

* Full CRUD operations for members
* Activate/deactivate member accounts
* Avatar upload support
* Bulk member creation with account generation
* Update personal information, fitness goals, and training schedules

### Membership Packages & Subscriptions

* Service categories: **NORMAL**, **VIP**, and **FEMALE_ONLY**
* CRUD operations for membership packages, including pricing and session limits
* Enable or disable packages
* Member subscription registration with automatic invoice generation
* Membership renewal and package upgrades
* Transaction history and revenue reporting

### Personal Training System (PT)

* Trainer profiles including certifications, experience, body metrics, and work schedules
* Members can submit training session requests to trainers
* Training session scheduling and facility assignment
* Attendance confirmation (automatically confirmed within 3 hours before the session)
* Post-session ratings and feedback

### Feedback Management

* Members can submit feedback regarding equipment, services, or trainers
* Employees can process feedback and add internal notes
* Feedback statistics dashboard

### Employee Management (Owner)

* CRUD operations for employees (Managers, Trainers, Admins)
* Position and salary tracking
* Dedicated trainer profile management
* Self-service profile updates for employees

### Facility & Equipment Management

* Management of multiple gym branches and facilities
* Equipment inventory management by facility
* Facility status tracking and equipment maintenance management

### Reports & Analytics (Owner/Manager)

* Revenue reports by time period
* Member analytics (demographics and trends)
* Employee and trainer performance reports
* Training session statistics
* PDF report export

### Real-Time Notifications

* Server-Sent Events (SSE) via `/notifications/stream`
* Notification history
* Mark all notifications as read

---

## Database

The system consists of **16 core database tables**:

| Table               | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `Role`              | System roles (OWNER, MANAGER, PT, MEMBER)                          |
| `Account`           | Authentication information (username, password hash, email)        |
| `AuthRefreshToken`  | Stores and revokes JWT refresh tokens                              |
| `Employee`          | Employee profile linked to an Account                              |
| `PT_Detail`         | Trainer-specific professional information linked to an Employee    |
| `Member`            | Member profile linked to an Account                                |
| `ServiceCategory`   | Service categories (NORMAL, VIP, FEMALE_ONLY)                      |
| `MembershipPackage` | Membership packages including pricing, session count, and duration |
| `Subscription`      | Member subscriptions to membership packages                        |
| `Invoice`           | Payment invoices automatically generated upon subscription         |
| `Facility`          | Gym facilities and branches                                        |
| `Equipment`         | Equipment inventory assigned to facilities                         |
| `TrainingBooking`   | Training session requests submitted by members                     |
| `TrainingSession`   | Scheduled training sessions                                        |
| `Feedback`          | Feedback submitted by members                                      |

---

## Installation & Setup

### Prerequisites

* Go 1.21+
* Node.js 18+
* PostgreSQL 12+

---

### 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE gymdb;"

# Run migrations in order
psql -U postgres -d gymdb -f backend/db/01_create_tables.sql
psql -U postgres -d gymdb -f backend/db/02_constraints_indexes.sql
psql -U postgres -d gymdb -f backend/db/03_functions_triggers.sql
psql -U postgres -d gymdb -f backend/db/04_seed_data.sql
```

---

### 2. Backend Setup

```bash
cd backend/go

# Copy environment configuration
cp .env.example .env

# Update .env with your database, JWT, and email settings

# Run seeders in the correct order
go run ./tools/seeder/seed_roles_accounts
go run ./tools/seeder/seed_employees_pt
go run ./tools/seeder/seed_members
go run ./tools/seeder/seed_service_packages
go run ./tools/seeder/seed_facilities_equipment
go run ./tools/seeder/seed_subscriptions_invoices
go run ./tools/seeder/seed_training
go run ./tools/seeder/seed_feedback

# Start the server
go run ./cmd/app/main.go
```

Backend server will be available at:

```text
http://localhost:8080
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Set API URL
VITE_API_URL=http://localhost:8080

# Start development server
npm run dev
```

Frontend application will be available at:

```text
http://localhost:5173
```

---

## Frontend Scripts

| Script      | Command           | Description                          |
| ----------- | ----------------- | ------------------------------------ |
| Development | `npm run dev`     | Start development server with HMR    |
| Build       | `npm run build`   | Build production bundle into `dist/` |
| Lint        | `npm run lint`    | Run ESLint checks                    |
| Preview     | `npm run preview` | Preview production build locally     |

---

## Environment Variables

### Backend (`backend/go/.env`)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=gymdb
DB_SSLMODE=disable

# JWT
JWT_SECRET=your_base64_secret_key
JWT_ACCESS_TTL_MINUTES=15
JWT_REFRESH_TTL_HOURS=168

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Email (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

> **Note:** `MAIL_PASS` must be a Gmail App Password, not your regular Google account password. Enable Two-Factor Authentication (2FA) and generate an App Password from your Google Account settings.

---

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK_AUTH=false
```

---

## System Architecture

### Backend — Clean Architecture

```text
cmd/app/main.go          → Dependency Injection & Application Bootstrap

internal/domain/
  entity/                → Domain entities and data structures
  adapter/               → Request/Response DTO adapters
  usecase/               → Core business logic

internal/infra/
  api/handlers/          → HTTP request handlers
  api/routes/            → Route registration and middleware setup
  api/middleware/        → JWT Auth, CORS, Logging, Recovery
  postgresql/            → PostgreSQL connection layer
  email/                 → Gmail SMTP service
  notification/          → In-memory SSE notification hub

repository/              → Data access layer and SQL queries
```

---

### Frontend — Feature-Based Architecture

```text
pages/                   → Role-based pages (Owner/Manager/Trainer/Member)

components/              → Reusable UI components

hooks/queries/           → TanStack Query hooks (GET requests)

hooks/mutations/         → TanStack Query hooks (POST/PUT/DELETE)

store/                   → Zustand stores (Auth, Theme, UI)

services/                → Axios API services

schemas/                 → Zod validation schemas
```

---

## Authentication Flow

1. Client sends `POST /auth/login`
2. Server returns:

   * Access Token (valid for 15 minutes)
   * Refresh Token (valid for 168 hours)
3. Client includes the access token in every authenticated request:

```http
Authorization: Bearer <accessToken>
```

4. When the access token expires, the client automatically calls:

```http
POST /auth/refresh
```

5. During logout, the refresh token is revoked and removed from the database.

---



## Academic Information

**Course:** ITSS (IT Systems and Services)

**Semester:** 2025.2

**Project:** Gym Management System

**Team:** ITSS Group 15

---

© ITSS Group 15 — Semester 2025.2

