# Item 14 - Frontend API Documentation and Postman Guide

Chuan API contract cho frontend (auth + account)
Quy uoc ma loi HTTP
RBAC matrix theo router hien tai
Huong dan test Postman end-to-end
Script Postman de tu dong luu access_token va refresh_token

## 1. Scope
Tai lieu nay chuan hoa cach frontend goi API va cach test bang Postman cho backend Go hien tai.

## 2. Base URL
- Local: `http://localhost:8080`

## 3. Common Conventions
- Request body: `Content-Type: application/json`
- Protected APIs: phai gui header
  - `Authorization: Bearer <access_token>`
- Error handling (hien tai): backend tra plain text trong body khi loi (`http.Error`)

## 4. Standard HTTP Status Mapping
- `200 OK`: request thanh cong
- `201 Created`: tao moi thanh cong
- `204 No Content`: xoa/dang xuat thanh cong
- `400 Bad Request`: du lieu vao sai/khong du
- `401 Unauthorized`: thieu token, token sai, sai credentials
- `403 Forbidden`: dung token nhung khong du role
- `409 Conflict`: resource da ton tai (vi du username)
- `500 Internal Server Error`: loi server

## 5. Auth API Contract
### 5.1 Register
- Method/Path: `POST /auth/register`
- Request:
```json
{
  "username": "owner01",
  "password": "123456",
  "role_id": 1
}
```
- Response `201`:
```json
{
  "account_id": 1,
  "username": "owner01",
  "role": "OWNER",
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in_secs": 900
}
```

### 5.2 Login
- Method/Path: `POST /auth/login`
- Request:
```json
{
  "username": "owner01",
  "password": "123456"
}
```
- Response `200`: cung format nhu register

### 5.3 Refresh
- Method/Path: `POST /auth/refresh`
- Request:
```json
{
  "refresh_token": "..."
}
```
- Response `200`: token moi (access + refresh moi)

### 5.4 Logout
- Method/Path: `POST /auth/logout`
- Header: `Authorization: Bearer <access_token>`
- Request:
```json
{
  "refresh_token": "..."
}
```
- Response `204`: thanh cong, khong body

## 6. Account API Contract (safe response)
### 6.1 Create Account
- Method/Path: `POST /accounts`
- Header: `Authorization: Bearer <access_token>`
- Request:
```json
{
  "username": "manager01",
  "password": "123456",
  "role_id": 2
}
```
- Response `201`:
```json
{
  "id": 10,
  "username": "manager01",
  "role_id": 2
}
```

### 6.2 Get Account by ID
- Method/Path: `GET /accounts/{id}`
- Response `200`:
```json
{
  "id": 10,
  "username": "manager01",
  "role_id": 2
}
```

### 6.3 Get All Accounts
- Method/Path: `GET /accounts`
- Response `200`:
```json
[
  {
    "id": 10,
    "username": "manager01",
    "role_id": 2
  }
]
```

### 6.4 Update Account
- Method/Path: `PUT /accounts/{id}`
- Request:
```json
{
  "username": "manager01",
  "password": "newpass123",
  "role_id": 2
}
```
- Note:
  - Neu `password` rong (`""`) thi he thong giu password cu.
  - Neu co `password` thi se duoc hash truoc khi luu.
- Response `200`: format AccountResponse (khong co password)

### 6.5 Delete Account
- Method/Path: `DELETE /accounts/{id}`
- Response `204`

## 7. RBAC Matrix (theo router hien tai)
### 7.1 Public
- `/auth/register`, `/auth/login`, `/auth/refresh`

### 7.2 Authenticated + role OWNER/MANAGER
- Employee CRUD
- Role CRUD
- Facility CRUD
- Equipment CRUD
- Account CRUD
- ServiceCategory CRUD
- Package CUD
- Member CUD
- Subscription CUD
- PTDetail CUD

### 7.3 Authenticated + role OWNER/MANAGER/PT
- Member list
- Subscription list
- TrainingBooking list/update/delete
- TrainingSession create/list/update/delete
- PTDetail list
- Feedback list/update/delete

### 7.4 Authenticated + all roles (OWNER/MANAGER/PT/MEMBER)
- Package list/get-by-id
- Member get-by-id
- Subscription get-by-id
- TrainingBooking create/get-by-id
- TrainingSession get-by-id
- Feedback create/get-by-id
- `/auth/logout`

## 8. Postman Quick Setup
### 8.1 Tao Environment
Tao 1 environment, dat cac bien:
- `base_url = http://localhost:8080`
- `username = owner01`
- `password = 123456`
- `role_id = 1`
- `access_token =`
- `refresh_token =`

### 8.2 Tao Collection
Tao collection `Gym Backend API`, sau do tao request theo thu tu:
1. `POST {{base_url}}/auth/register`
2. `POST {{base_url}}/auth/login`
3. `POST {{base_url}}/auth/refresh`
4. `POST {{base_url}}/auth/logout`
5. `GET {{base_url}}/packages` (protected)

### 8.3 Pre-request Script cho request protected
```javascript
pm.request.headers.upsert({
  key: "Authorization",
  value: "Bearer " + pm.environment.get("access_token")
});
```

### 8.4 Tests script de luu token (cho register/login/refresh)
```javascript
let json;
try {
  json = pm.response.json();
} catch (e) {
  json = null;
}
if (json && json.access_token) {
  pm.environment.set("access_token", json.access_token);
}
if (json && json.refresh_token) {
  pm.environment.set("refresh_token", json.refresh_token);
}
```

## 9. Suggested Test Flow in Postman
1. Register 1 user moi (hoac bo qua neu da co).
2. Login de lay access/refresh token.
3. Goi 1 API protected (vi du `GET /packages`) voi bearer token.
4. Refresh token de kiem tra rotate token.
5. Logout bang refresh token moi.
6. Goi lai API protected bang access token cu de kiem tra hanh vi sau logout (du kien se bi chan khi access token het han hoac bi invalid theo policy).

## 10. Notes for Frontend Team
- Frontend nen bat `401` de tu dong goi `/auth/refresh` mot lan.
- Neu refresh fail, xoa session local va dieu huong ve trang login.
- Khong luu plain password o bat ky state persistent nao.
