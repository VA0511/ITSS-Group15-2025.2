# Auth Scope And Structure (Item 1 + 2)

## 1) Chot pham vi chuc nang Auth

### 1.1 Muc tieu MVP
Hoan thanh bo chuc nang dang ky, dang nhap, dang xuat va phan quyen theo vai tro de bao ve cac API nghiep vu.

### 1.2 Cac endpoint bat buoc (MVP)
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### 1.3 Cac endpoint tuy chon (nen co)
- `POST /auth/logout-all` (dang xuat tat ca thiet bi)
- `GET /auth/me` (lay profile + role tu token)

### 1.4 Vai tro va phan quyen
- Vai tro su dung: `OWNER`, `MANAGER`, `PT`, `MEMBER`.
- Token claims bat buoc: `sub` (account id), `role`, `exp`, `iat`, `jti`.
- Rule co ban:
  - `OWNER`: full access
  - `MANAGER`: quan ly van hanh, khong can full owner setting
  - `PT`: chi truy cap API lien quan lich training/member duoc gan
  - `MEMBER`: chi truy cap tai nguyen cua chinh minh

### 1.5 Chinh sach token
- Access token: han ngan (de xuat 15 phut).
- Refresh token: han dai (de xuat 7 ngay).
- Refresh token phai luu duoi dang hash trong DB (khong luu token raw).
- Dang xuat = revoke refresh token hien tai.
- Logout-all = revoke toan bo refresh token cua account (hoac tang token_version).

### 1.6 Chinh sach mat khau
- Dang ky: hash bcrypt truoc khi luu.
- Dang nhap: dung bcrypt compare.
- Tuyet doi khong tra `password`/`password hash` trong response.
- Doi mat khau (neu co): hash lai truoc khi update.

### 1.7 Quy uoc ma loi HTTP
- `400`: du lieu dau vao khong hop le
- `401`: sai thong tin dang nhap / token khong hop le
- `403`: dung token nhung khong du quyen
- `409`: username/email da ton tai
- `500`: loi he thong

### 1.8 Tieu chi hoan thanh Item 1
- Co tai lieu API auth ro rang cho frontend.
- Co decision ro ve role matrix va token policy.
- Co quy uoc loi thong nhat cho auth + phan quyen.

---

## 2) Chuan hoa cau truc module Auth trong backend Go

Module auth phai di theo layering hien co cua du an: `entity -> adapter -> usecase -> repository -> handler -> routes -> middleware`.

### 2.1 Cau truc thu muc de xuat
```text
backend/go/internal/
  domain/
    adapter/
      auth_adapter.go
    usecase/
      auth_usecase/
        usecase.go
        register.go
        login.go
        refresh.go
        logout.go
  repository/
    auth.go
  infra/api/
    dto/
      auth_dtos.go
    handlers/
      auth_api.go
    middleware/
      auth_jwt.go
      authorize.go
    routes/
      auth_routes.go
```

### 2.2 Trach nhiem tung lop
- `dto/auth_dtos.go`:
  - Request/response cho `register`, `login`, `refresh`, `logout`.
  - Khong de lo password hash.
- `handlers/auth_api.go`:
  - Parse request, goi usecase, map HTTP status code.
- `domain/usecase/auth_usecase/*`:
  - Chua business logic auth (validate, compare password, issue token, revoke token).
- `domain/adapter/auth_adapter.go`:
  - Khai bao contract repository can co cho auth.
- `repository/auth.go`:
  - Truy van DB cho auth (find account by username, save/revoke refresh token, lay role).
- `middleware/auth_jwt.go`:
  - Xac thuc JWT, parse claims, set context user.
- `middleware/authorize.go`:
  - Check role theo route.
- `routes/auth_routes.go`:
  - Khai bao route public/protected cua auth module.

### 2.3 Quy uoc route
- Public: `/auth/register`, `/auth/login`, `/auth/refresh`.
- Protected: `/auth/logout`, `/auth/logout-all`, `/auth/me`.
- API nghiep vu khac duoc bao ve boi `auth_jwt` + `authorize` tuy theo role.

### 2.4 Quy uoc wiring trong app
- `cmd/app/main.go`:
  - Khoi tao `auth repository` -> `auth usecase` -> `auth handler`.
- `infra/api/routes/router.go`:
  - Mount auth routes vao router tong.
- Khong lam anh huong cac module CRUD hien tai trong giai doan scaffold.

### 2.5 Tieu chi hoan thanh Item 2
- Co day du file scaffold theo cau truc tren.
- Build pass sau khi mount auth routes (khong pha vo module cu).
- Route auth public/protected tach biet ro rang.
- Co middleware JWT va middleware authorize duoc tai su dung.

---

## Ghi chu quan trong truoc khi code JWT/RBAC
- Hien tai API account dang tra truc tiep entity, can doi sang response DTO de tranh lo password hash.
- Update account hien tai can bo sung hash password neu cho phep update password.
- DB connection string dang hard-code, nen dua vao environment variables truoc khi deploy.
