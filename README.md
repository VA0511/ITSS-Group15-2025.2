# Gym Management System — ITSS Group 15 (2025.2)

Hệ thống quản lý phòng tập thể dục toàn diện, hỗ trợ 4 vai trò người dùng (Owner, Manager, Trainer/PT, Member) với giao diện web hiện đại và API RESTful.

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Tech Stack](#tech-stack)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tính năng](#tính-năng)
- [Cơ sở dữ liệu](#cơ-sở-dữ-liệu)
- [API Endpoints](#api-endpoints)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [Thành viên nhóm](#thành-viên-nhóm)

---

## Tổng quan

Hệ thống cung cấp đầy đủ nghiệp vụ cho một phòng gym:

- Quản lý hội viên, gói tập, đăng ký & hóa đơn
- Đặt lịch tập cá nhân với PT (Personal Trainer)
- Quản lý nhân viên, cơ sở vật chất & thiết bị
- Báo cáo doanh thu, thống kê hiệu suất
- Thông báo thời gian thực qua Server-Sent Events (SSE)
- Đặt lại mật khẩu qua Gmail SMTP

---

## Tech Stack

### Backend

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ | Go 1.25.3 |
| HTTP Router | Gorilla Mux v1.8.1 |
| Cơ sở dữ liệu | PostgreSQL |
| Driver DB | `github.com/lib/pq` |
| Xác thực | JWT (`github.com/golang-jwt/jwt/v5`) |
| Mã hóa mật khẩu | Bcrypt (`golang.org/x/crypto`) |
| Cấu hình | Godotenv |
| Email | Gmail SMTP |

### Frontend

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19.2 |
| Build Tool | Vite 8.0 |
| Routing | React Router v7 |
| Styling | Tailwind CSS 4.2 (Dark mode) |
| Server State | TanStack React Query 5.94 |
| Client State | Zustand 5.0 |
| Form | React Hook Form 7.72 + Zod 4.3 |
| HTTP Client | Axios 1.13 |
| Animation | Framer Motion 12.40 |
| Charts | Recharts 3.8 |
| Icons | Lucide React 0.577 |
| Notifications | Sonner 2.0 |
| Date Utils | date-fns 4.1 |

---

## Cấu trúc dự án

```
ITSS-Group15-2025.2/
├── backend/
│   ├── db/                              # SQL migrations & seed data
│   │   ├── 01_create_tables.sql         # Định nghĩa 16 bảng
│   │   ├── 02_constraints_indexes.sql   # Ràng buộc & chỉ mục
│   │   ├── 03_functions_triggers.sql    # Hàm & trigger PostgreSQL
│   │   └── 04_seed_data.sql             # Dữ liệu mẫu ban đầu
│   └── go/                              # Go application
│       ├── cmd/app/main.go              # Entry point, khởi tạo DI
│       ├── go.mod / go.sum
│       ├── .env                         # Cấu hình môi trường
│       ├── internal/
│       │   ├── domain/
│       │   │   ├── entity/              # 14 kiểu entity (struct)
│       │   │   ├── adapter/             # DTO adapters (request/response)
│       │   │   └── usecase/             # Business logic (16 package)
│       │   ├── infra/
│       │   │   ├── api/
│       │   │   │   ├── handlers/        # HTTP handlers (18+ file)
│       │   │   │   ├── routes/          # Định nghĩa 200+ routes
│       │   │   │   └── middleware/      # Auth, Logging, Recovery, CORS
│       │   │   ├── postgresql/          # Kết nối DB
│       │   │   ├── email/               # Gmail SMTP service
│       │   │   └── notification/        # In-memory SSE hub
│       │   └── repository/              # Data access layer (15 repo)
│       ├── tools/seeder/                # Seed data generators
│       │   ├── seed_roles_accounts/
│       │   ├── seed_employees_pt/
│       │   ├── seed_members/
│       │   ├── seed_service_packages/
│       │   ├── seed_facilities_equipment/
│       │   ├── seed_subscriptions_invoices/
│       │   ├── seed_training/
│       │   └── seed_feedback/
│       ├── uploads/avatars/             # Lưu trữ ảnh đại diện
│       └── docs/                        # Tài liệu API
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env / .env.example
    └── src/
        ├── main.jsx / App.jsx           # Entry point React
        ├── routes/
        │   ├── index.jsx                # 200+ route definitions
        │   ├── PrivateRoute.jsx         # Bảo vệ route cần đăng nhập
        │   └── RoleBasedRoute.jsx       # Kiểm tra quyền theo vai trò
        ├── pages/                       # 74 page components
        │   ├── Login/                   # Đăng nhập, quên mật khẩu
        │   ├── Owner/                   # Dashboard & quản lý toàn hệ thống
        │   ├── Manager/                 # Dashboard & quản lý hàng ngày
        │   ├── Trainer/                 # Portal PT
        │   └── Member/                  # Portal hội viên
        ├── components/                  # UI components tái sử dụng
        │   ├── Charts/                  # Biểu đồ dữ liệu
        │   ├── Dashboard/               # Layout dashboard
        │   ├── Forms/                   # Form components
        │   ├── Layout/                  # MainLayout, TrainerLayout
        │   └── Common/                  # Shared components
        ├── hooks/
        │   ├── mutations/               # 12+ useMutation hooks
        │   └── queries/                 # 14+ useQuery hooks
        ├── store/                       # Zustand stores
        │   ├── useAuthStore.js          # Trạng thái xác thực
        │   ├── useThemeStore.js         # Dark/Light mode
        │   ├── useTrainerStore.js       # Trạng thái Trainer
        │   └── useUIStore.js            # Trạng thái UI chung
        ├── services/                    # API service layer (Axios)
        ├── schemas/                     # Zod validation schemas
        ├── utils/                       # Hàm tiện ích
        └── lib/                         # queryClient, cấu hình chung
```

---

## Tính năng

### Xác thực & Phân quyền
- Đăng nhập bằng username/password, JWT (access token 15 phút + refresh token 168 giờ)
- 4 vai trò: **OWNER**, **MANAGER**, **PT** (Trainer), **MEMBER**
- Đặt lại mật khẩu qua email (Gmail SMTP)
- Cờ "First Login" để yêu cầu đổi mật khẩu lần đầu

### Quản lý Hội viên
- CRUD hội viên, cập nhật trạng thái (active/inactive)
- Upload ảnh đại diện
- Tạo hội viên hàng loạt kèm tài khoản
- Chỉnh sửa mục tiêu, lịch tập, thông tin cá nhân

### Gói tập & Đăng ký
- Danh mục dịch vụ: **NORMAL**, **VIP**, **FEMALE_ONLY**
- CRUD gói tập với giá, số buổi, kích hoạt/vô hiệu hóa
- Đăng ký gói cho hội viên, tự động tạo hóa đơn
- Gia hạn, nâng cấp gói tập
- Lịch sử giao dịch & báo cáo doanh thu

### Hệ thống Tập luyện (PT)
- Hồ sơ PT: chứng chỉ, kinh nghiệm, chỉ số cơ thể, lịch làm việc
- Hội viên gửi yêu cầu đặt buổi tập với PT
- Sắp xếp lịch buổi tập, phân công cơ sở vật chất
- Xác nhận điểm danh (tự động xác nhận sau 3 giờ trước buổi tập)
- Đánh giá & phản hồi sau buổi tập

### Phản hồi (Feedback)
- Hội viên gửi phản hồi về thiết bị, dịch vụ, huấn luyện viên
- Nhân viên xử lý phản hồi với ghi chú
- Dashboard thống kê phản hồi

### Quản lý Nhân viên (Owner)
- CRUD nhân viên (Manager, PT, Admin)
- Theo dõi vị trí, lương
- Hồ sơ PT riêng (chứng chỉ, kinh nghiệm)
- Nhân viên tự cập nhật hồ sơ của mình

### Cơ sở vật chất & Thiết bị
- Quản lý nhiều cơ sở/phòng tập
- Danh sách thiết bị theo cơ sở
- Theo dõi trạng thái cơ sở & bảo trì thiết bị

### Báo cáo & Thống kê (Owner/Manager)
- Báo cáo doanh thu theo thời gian
- Thống kê hội viên (nhân khẩu học, xu hướng)
- Hiệu suất nhân viên & PT
- Thống kê buổi tập
- Xuất báo cáo PDF

### Thông báo thời gian thực
- Server-Sent Events (SSE) qua `/notifications/stream`
- Lịch sử thông báo
- Đánh dấu tất cả đã đọc

---

## Cơ sở dữ liệu

Gồm **16 bảng** chính:

| Bảng | Mô tả |
|---|---|
| `Role` | Vai trò hệ thống (OWNER, MANAGER, PT, MEMBER) |
| `Account` | Thông tin đăng nhập (username, password hash, email) |
| `AuthRefreshToken` | Lưu & thu hồi refresh token JWT |
| `Employee` | Hồ sơ nhân viên (liên kết Account) |
| `PT_Detail` | Thông tin chuyên môn PT (liên kết Employee) |
| `Member` | Hồ sơ hội viên (liên kết Account) |
| `ServiceCategory` | Danh mục dịch vụ (NORMAL, VIP, FEMALE_ONLY) |
| `MembershipPackage` | Gói tập với giá, số buổi, thời hạn |
| `Subscription` | Đăng ký gói của hội viên |
| `Invoice` | Hóa đơn thanh toán (tự tạo khi đăng ký) |
| `Facility` | Cơ sở/phòng tập |
| `Equipment` | Thiết bị tập luyện theo cơ sở |
| `TrainingBooking` | Yêu cầu đặt lịch của hội viên với PT |
| `TrainingSession` | Buổi tập đã được lên lịch |
| `Feedback` | Phản hồi của hội viên |

---

## API Endpoints

### Public (Không cần xác thực)

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/refresh` | Làm mới access token |
| POST | `/auth/logout` | Đăng xuất |
| POST | `/auth/forgot-password` | Yêu cầu đặt lại mật khẩu |
| POST | `/auth/reset-password` | Đặt lại mật khẩu bằng token |

### Tất cả người dùng đã xác thực

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/auth/me` | Thông tin người dùng hiện tại |
| PUT | `/auth/change-password` | Đổi mật khẩu |
| POST | `/upload/avatar` | Upload ảnh đại diện |
| GET | `/packages` | Danh sách gói tập |
| GET | `/facilities` | Danh sách cơ sở |
| GET | `/training-sessions` | Danh sách buổi tập |
| GET | `/notifications` | Lịch sử thông báo |
| GET | `/notifications/stream` | SSE stream thông báo |
| POST | `/notifications/read-all` | Đánh dấu tất cả đã đọc |

### Owner & Manager

| Nhóm | Mô tả |
|---|---|
| `/members` | CRUD hội viên, quản lý trạng thái |
| `/employees` | CRUD nhân viên |
| `/accounts` | CRUD tài khoản |
| `/packages` | CRUD gói tập, thay đổi trạng thái |
| `/service-categories` | CRUD danh mục dịch vụ |
| `/subscriptions` | CRUD đăng ký, lịch sử |
| `/invoices` | Xem hóa đơn |
| `/pt-details` | CRUD hồ sơ PT |
| `/facilities` | CRUD cơ sở vật chất |
| `/equipment` | CRUD thiết bị |
| `/reports` | Báo cáo doanh thu, hội viên, nhân viên |
| `/training-bookings` | Quản lý yêu cầu đặt lịch |

### Self-service Endpoints

| Method | Endpoint | Vai trò |
|---|---|---|
| GET/PUT | `/employees/me` | Nhân viên tự xem/cập nhật hồ sơ |
| GET/PUT | `/pt-details/me` | PT tự xem/cập nhật hồ sơ |
| GET | `/members/me/subscriptions` | Hội viên xem gói đang dùng |
| GET | `/members/me/feedbacks` | Hội viên xem lịch sử phản hồi |

---

## Cài đặt & Chạy

### Yêu cầu

- Go 1.21+
- Node.js 18+
- PostgreSQL 12+

### 1. Cài đặt cơ sở dữ liệu

```bash
# Tạo database
psql -U postgres -c "CREATE DATABASE gymdb;"

# Chạy migrations theo thứ tự
psql -U postgres -d gymdb -f backend/db/01_create_tables.sql
psql -U postgres -d gymdb -f backend/db/02_constraints_indexes.sql
psql -U postgres -d gymdb -f backend/db/03_functions_triggers.sql
psql -U postgres -d gymdb -f backend/db/04_seed_data.sql
```

### 2. Cài đặt Backend

```bash
cd backend/go

# Sao chép file cấu hình
cp .env.example .env
# Chỉnh sửa .env với thông tin DB, JWT, Email của bạn

# Chạy seed data (theo đúng thứ tự)
go run ./tools/seeder/seed_roles_accounts
go run ./tools/seeder/seed_employees_pt
go run ./tools/seeder/seed_members
go run ./tools/seeder/seed_service_packages
go run ./tools/seeder/seed_facilities_equipment
go run ./tools/seeder/seed_subscriptions_invoices
go run ./tools/seeder/seed_training
go run ./tools/seeder/seed_feedback

# Khởi động server
go run ./cmd/app/main.go
```

Server khởi động tại `http://localhost:8080`

### 3. Cài đặt Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Sao chép file cấu hình
cp .env.example .env
# Đặt VITE_API_URL=http://localhost:8080

# Chạy development server
npm run dev
```

Frontend khởi động tại `http://localhost:5173`

### Scripts Frontend

| Script | Lệnh | Mô tả |
|---|---|---|
| Dev | `npm run dev` | Khởi động dev server với HMR |
| Build | `npm run build` | Build production vào `dist/` |
| Lint | `npm run lint` | Kiểm tra ESLint |
| Preview | `npm run preview` | Preview bản build production |

---

## Biến môi trường

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

> **Lưu ý:** `MAIL_PASS` là App Password của Gmail (không phải mật khẩu tài khoản). Cần bật 2FA và tạo App Password trong cài đặt Google Account.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK_AUTH=false
```

---

## Kiến trúc hệ thống

### Backend — Clean Architecture

```
cmd/app/main.go          → Dependency Injection, khởi động server
internal/domain/
  entity/                → Định nghĩa struct dữ liệu
  adapter/               → DTO chuyển đổi request/response
  usecase/               → Business logic thuần túy
internal/infra/
  api/handlers/          → HTTP handler (nhận request, gọi usecase)
  api/routes/            → Đăng ký routes & middleware
  api/middleware/        → JWT Auth, CORS, Logging, Recovery
  postgresql/            → Kết nối PostgreSQL
  email/                 → Gmail SMTP
  notification/          → SSE hub in-memory
repository/              → Truy cập dữ liệu (SQL queries)
```

### Frontend — Feature-based

```
pages/                   → Page theo vai trò (Owner/Manager/Trainer/Member)
components/              → UI components tái sử dụng
hooks/queries/           → TanStack Query (GET requests)
hooks/mutations/         → TanStack Query (POST/PUT/DELETE)
store/                   → Zustand stores (auth, theme, UI)
services/                → Axios API calls
schemas/                 → Zod validation
```

### Luồng xác thực

1. Client gửi `POST /auth/login` → nhận `accessToken` (15 phút) + `refreshToken` (168 giờ)
2. Mỗi request gửi kèm `Authorization: Bearer <accessToken>`
3. Khi access token hết hạn, client tự động gọi `POST /auth/refresh`
4. Đăng xuất thu hồi refresh token khỏi DB

---

## Thành viên nhóm

| Tên | MSSV |
|---|---|
| Nguyễn Mạnh Tuấn | 20235862 |
| *(Các thành viên khác)* | |

---

*ITSS Group 15 — Học kỳ 2025.2*
