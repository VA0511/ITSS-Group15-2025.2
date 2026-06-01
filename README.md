Gym Management System — ITSS Group 15 (2025.2)A comprehensive gym management system supporting 4 user roles (Owner, Manager, Trainer/PT, Member) with a modern web interface and RESTful API.Table of ContentsOverviewTech StackProject StructureFeaturesDatabaseAPI EndpointsSetup & RunEnvironment VariablesTeam MembersOverviewThe system provides complete business operations for a gym:Member management, training packages, subscriptions & invoicesPersonal training (PT) schedulingEmployee, facility & equipment managementRevenue reporting, performance statisticsReal-time notifications via Server-Sent Events (SSE)Password reset via Gmail SMTPTech StackBackendComponentTechnologyLanguageGo 1.25.3HTTP RouterGorilla Mux v1.8.1DatabasePostgreSQLDB Driver[github.com/lib/pq](https://github.com/lib/pq)AuthenticationJWT ([github.com/golang-jwt/jwt/v5](https://github.com/golang-jwt/jwt/v5))Password EncryptionBcrypt (golang.org/x/crypto)ConfigurationGodotenvEmailGmail SMTPFrontendComponentTechnologyFrameworkReact 19.2Build ToolVite 8.0RoutingReact Router v7StylingTailwind CSS 4.2 (Dark mode)Server StateTanStack React Query 5.94Client StateZustand 5.0FormReact Hook Form 7.72 + Zod 4.3HTTP ClientAxios 1.13AnimationFramer Motion 12.40ChartsRecharts 3.8IconsLucide React 0.577NotificationsSonner 2.0Date Utilsdate-fns 4.1Project StructurePlaintextITSS-Group15-2025.2/
├── backend/
│   ├── db/                              # SQL migrations & seed data
│   │   ├── 01_create_tables.sql         # Defines 16 tables
│   │   ├── 02_constraints_indexes.sql   # Constraints & indexes
│   │   ├── 03_functions_triggers.sql    # PostgreSQL functions & triggers
│   │   └── 04_seed_data.sql             # Initial seed data
│   └── go/                              # Go application
│       ├── cmd/app/main.go              # Entry point, DI initialization
│       ├── go.mod / go.sum
│       ├── .env                         # Environment configuration
│       ├── internal/
│       │   ├── domain/
│       │   │   ├── entity/              # 14 entity types (structs)
│       │   │   ├── adapter/             # DTO adapters (request/response)
│       │   │   └── usecase/             # Business logic (16 packages)
│       │   ├── infra/
│       │   │   ├── api/
│       │   │   │   ├── handlers/        # HTTP handlers (18+ files)
│       │   │   │   ├── routes/          # 200+ route definitions
│       │   │   │   └── middleware/      # Auth, Logging, Recovery, CORS
│       │   │   ├── postgresql/          # DB connection
│       │   │   ├── email/               # Gmail SMTP service
│       │   │   └── notification/        # In-memory SSE hub
│       │   └── repository/              # Data access layer (15 repos)
│       ├── tools/seeder/                # Seed data generators
│       │   ├── seed_roles_accounts/
│       │   ├── seed_employees_pt/
│       │   ├── seed_members/
│       │   ├── seed_service_packages/
│       │   ├── seed_facilities_equipment/
│       │   ├── seed_subscriptions_invoices/
│       │   ├── seed_training/
│       │   └── seed_feedback/
│       ├── uploads/avatars/             # Avatar storage
│       └── docs/                        # API documentation
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env / .env.example
    └── src/
        ├── main.jsx / App.jsx           # React entry point
        ├── routes/
        │   ├── index.jsx                # 200+ route definitions
        │   ├── PrivateRoute.jsx         # Protects routes requiring login
        │   └── RoleBasedRoute.jsx       # Role-based access control
        ├── pages/                       # 74 page components
        │   ├── Login/                   # Login, forgot password
        │   ├── Owner/                   # Dashboard & system-wide management
        │   ├── Manager/                 # Dashboard & daily management
        │   ├── Trainer/                 # PT Portal
        │   └── Member/                  # Member Portal
        ├── components/                  # Reusable UI components
        │   ├── Charts/                  # Data charts
        │   ├── Dashboard/               # Dashboard layouts
        │   ├── Forms/                   # Form components
        │   ├── Layout/                  # MainLayout, TrainerLayout
        │   └── Common/                  # Shared components
        ├── hooks/
        │   ├── mutations/               # 12+ useMutation hooks
        │   └── queries/                 # 14+ useQuery hooks
        ├── store/                       # Zustand stores
        │   ├── useAuthStore.js          # Authentication state
        │   ├── useThemeStore.js         # Dark/Light mode
        │   ├── useTrainerStore.js       # Trainer state
        │   └── useUIStore.js            # General UI state
        ├── services/                    # API service layer (Axios)
        ├── schemas/                     # Zod validation schemas
        ├── utils/                       # Utility functions
        └── lib/                         # queryClient, global configs
FeaturesAuthentication & AuthorizationLogin using username/password, JWT (15-minute access token + 168-hour refresh token)4 roles: OWNER, MANAGER, PT (Trainer), MEMBERPassword reset via email (Gmail SMTP)"First Login" flag to force password change on initial loginMember ManagementMember CRUD, status updates (active/inactive)Avatar uploadsBulk member creation with accountsEdit fitness goals, workout schedules, and personal infoTraining Packages & SubscriptionsService categories: NORMAL, VIP, FEMALE_ONLYPackage CRUD with pricing, session counts, activation/deactivationSubscribe members to packages, automatic invoice generationPackage renewal and upgradesTransaction history & revenue reportingTraining System (PT)PT profiles: certifications, experience, body metrics, work schedulesMembers can send booking requests to PTsSchedule training sessions, assign facilitiesAttendance confirmation (auto-confirmed 3 hours before the session)Post-session ratings & feedbackFeedbackMembers can submit feedback regarding equipment, services, or trainersStaff can process feedback and add notesFeedback statistics dashboardEmployee Management (Owner)Employee CRUD (Manager, PT, Admin)Track location, salarySeparate PT profiles (certifications, experience)Employees can update their own profilesFacilities & EquipmentMulti-facility/gym managementEquipment list per facilityTrack facility status & equipment maintenanceReports & Statistics (Owner/Manager)Revenue reports over timeMember statistics (demographics, trends)Employee & PT performanceTraining session statisticsExport PDF reportsReal-time NotificationsServer-Sent Events (SSE) via /notifications/streamNotification historyMark all as read functionalityDatabaseConsists of 16 main tables:TableDescriptionRoleSystem roles (OWNER, MANAGER, PT, MEMBER)AccountLogin credentials (username, password hash, email)AuthRefreshTokenStores & revokes JWT refresh tokensEmployeeEmployee profiles (linked to Account)PT_DetailProfessional PT info (linked to Employee)MemberMember profiles (linked to Account)ServiceCategoryService categories (NORMAL, VIP, FEMALE_ONLY)MembershipPackageTraining packages with price, sessions, durationSubscriptionMember package subscriptionsInvoicePayment invoices (auto-generated upon subscription)FacilityFacilities/gym branchesEquipmentTraining equipment by facilityTrainingBookingMember booking requests with PTsTrainingSessionScheduled training sessionsFeedbackMember feedbackAPI EndpointsPublic (No Authentication Required)MethodEndpointDescriptionPOST/auth/loginLoginPOST/auth/refreshRefresh access tokenPOST/auth/logoutLogoutPOST/auth/forgot-passwordRequest password resetPOST/auth/reset-passwordReset password using tokenAll Authenticated UsersMethodEndpointDescriptionGET/auth/meCurrent user infoPUT/auth/change-passwordChange passwordPOST/upload/avatarUpload avatarGET/packagesList training packagesGET/facilitiesList facilitiesGET/training-sessionsList training sessionsGET/notificationsNotification historyGET/notifications/streamSSE notification streamPOST/notifications/read-allMark all as readOwner & ManagerGroupDescription/membersMember CRUD, status management/employeesEmployee CRUD/accountsAccount CRUD/packagesPackage CRUD, status changes/service-categoriesService category CRUD/subscriptionsSubscription CRUD, history/invoicesView invoices/pt-detailsPT profile CRUD/facilitiesFacility CRUD/equipmentEquipment CRUD/reportsRevenue, member, employee reports/training-bookingsManage booking requestsSelf-service EndpointsMethodEndpointRoleGET/PUT/employees/meEmployees view/update own profileGET/PUT/pt-details/mePTs view/update own profileGET/members/me/subscriptionsMembers view active packagesGET/members/me/feedbacksMembers view feedback historySetup & RunRequirementsGo 1.21+Node.js 18+PostgreSQL 12+1. Database SetupBash# Create database
psql -U postgres -c "CREATE DATABASE gymdb;"

# Run migrations in order
psql -U postgres -d gymdb -f backend/db/01_create_tables.sql
psql -U postgres -d gymdb -f backend/db/02_constraints_indexes.sql
psql -U postgres -d gymdb -f backend/db/03_functions_triggers.sql
psql -U postgres -d gymdb -f backend/db/04_seed_data.sql
2. Backend SetupBashcd backend/go

# Copy config file
cp .env.example .env
# Edit .env with your DB, JWT, and Email credentials

# Run seed data (in exact order)
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
The server will start at http://localhost:80803. Frontend SetupBashcd frontend

# Install dependencies
npm install

# Copy config file
cp .env.example .env
# Set VITE_API_URL=http://localhost:8080

# Run development server
npm run dev
The frontend will start at http://localhost:5173Frontend ScriptsScriptCommandDescriptionDevnpm run devStart dev server with HMRBuildnpm run buildBuild production to dist/Lintnpm run lintCheck ESLintPreviewnpm run previewPreview production buildEnvironment VariablesBackend (backend/go/.env)Đoạn mã# Database
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
Note: MAIL_PASS is a Gmail App Password (not your account password). You need to enable 2FA and generate an App Password in your Google Account settings.Frontend (frontend/.env)Đoạn mãVITE_API_URL=http://localhost:8080
VITE_USE_MOCK_AUTH=false
System ArchitectureBackend — Clean ArchitecturePlaintextcmd/app/main.go          → Dependency Injection, server startup
internal/domain/
  entity/                → Data struct definitions
  adapter/               → DTO request/response conversion
  usecase/               → Pure business logic
internal/infra/
  api/handlers/          → HTTP handlers (receives requests, calls usecases)
  api/routes/            → Route & middleware registration
  api/middleware/        → JWT Auth, CORS, Logging, Recovery
  postgresql/            → PostgreSQL connection
  email/                 → Gmail SMTP
  notification/          → In-memory SSE hub
repository/              → Data access (SQL queries)
Frontend — Feature-basedPlaintextpages/                   → Pages by role (Owner/Manager/Trainer/Member)
components/              → Reusable UI components
hooks/queries/           → TanStack Query (GET requests)
hooks/mutations/         → TanStack Query (POST/PUT/DELETE)
store/                   → Zustand stores (auth, theme, UI)
services/                → Axios API calls
schemas/                 → Zod validation
Authentication FlowClient sends POST /auth/login → receives accessToken (15 mins) + refreshToken (168 hours)Every subsequent request includes Authorization: Bearer <accessToken>When the access token expires, the client automatically calls POST /auth/refreshLogout revokes the refresh token from the DB
