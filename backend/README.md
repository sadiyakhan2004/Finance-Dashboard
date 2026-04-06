# Finance Dashboard Backend

A role-based finance management backend system built with Node.js, Express, and MongoDB. This system allows companies to track financial records, manage users, and view dashboard analytics based on user roles.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi (request body validation)
- **Module System**: ES Modules (import/export)

---

## Project Structure
```
finance-dashboard/
│
├── backend/
│   ├── config/
│   │   └── db.js                      → MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js         → Login logic
│   │   ├── user.controller.js         → User management
│   │   ├── transaction.controller.js  → Transaction CRUD
│   │   └── dashboard.controller.js    → Analytics and summary
│   ├── middlewares/
│   │   ├── auth.middleware.js         → JWT verification
│   │   └── role.middleware.js         → Role based access control
│   ├── models/
│   │   ├── user.model.js              → User schema
│   │   └── transaction.model.js       → Transaction schema
│   ├── routes/
│   │   ├── auth.routes.js             → Auth routes
│   │   ├── user.routes.js             → User routes
│   │   ├── transaction.routes.js      → Transaction routes
│   │   └── dashboard.routes.js        → Dashboard routes
│   ├── validations/
│   │   ├── user.validation.js         → User input validation
│   │   └── transaction.validation.js  → Transaction input validation
│   ├── scripts/
│   │   └── seed.js                    → Create admin account
│   ├── .env                           → Environment variables
│   ├── app.js                         → Express configuration
│   ├── package.json
│   └── server.js                      → Entry point
```

---

## Roles and Permissions

| Action | Admin | Analyst | Viewer |
|---|---|---|---|
| Login | ✅ | ✅ | ✅ |
| Create user | ✅ | ❌ | ❌ |
| View users | ✅ | ❌ | ❌ |
| Update user | ✅ | ❌ | ❌ |
| Delete user | ✅ | ❌ | ❌ |
| Create transaction | ✅ | ✅ | ❌ |
| View transactions | ✅ | ✅ | ✅ |
| Update transaction | ✅ | ✅ | ❌ |
| Delete transaction | ✅ | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ✅ |

---

## Getting Started

### Prerequisites

- Node.js v18 or above
- MongoDB installed and running locally
- Postman for API testing

---

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/sadiyakhan2004/Finance-Dashboard.git
cd finance-dashboard/backend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Setup environment variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.mirdr.mongodb.net/finance-dashboard
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

> **Replace the placeholders:**
> - `<db_username>` → your MongoDB Atlas username
> - `<db_password>` → your MongoDB Atlas password
> - `your_secret_key_here` → any long random string (e.g. `finance_dashboard_secret_key_2025`)


#### 4. Create admin account
```bash
node scripts/seed.js
```

You should see:
```
MongoDB Connected
Admin created successfully
Name  : Super Admin
Email : admin@techcorp.com
Role  : admin
```

#### 5. Start the server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## Validation

All incoming requests are validated using Joi before reaching controllers.

### Two Layer Validation
```
Layer 1 → Joi validation
runs first, catches all errors,
returns friendly messages to user

Layer 2 → Mongoose schema
acts as backup safety net,
protects database integrity
```

### Validation Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Amount must be a positive number",
    "Type must be income or expense",
    "Date is required"
  ]
}
```

---

## API Endpoints

### Auth Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/login | Public | Login and get token |

#### Login Request Body
```json
{
  "email": "admin@techcorp.com",
  "password": "admin123"
}
```

---

### User Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/users | Admin | Create new user |
| GET | /api/users | Admin | Get all users |
| GET | /api/users/:id | Admin | Get user by id |
| PUT | /api/users/:id | Admin | Update user |
| DELETE | /api/users/:id | Admin | Delete user |

#### Create User Request Body
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@techcorp.com",
  "password": "rahul123",
  "role": "analyst"
}
```

#### Update User Request Body
```json
{
  "name": "Rahul Sharma",
  "role": "analyst",
  "status": "inactive"
}
```

---

### Transaction Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/transactions | Admin, Analyst | Create transaction |
| GET | /api/transactions | All | Get all transactions |
| GET | /api/transactions/:id | All | Get transaction by id |
| PUT | /api/transactions/:id | Admin, Analyst | Update transaction |
| DELETE | /api/transactions/:id | Admin | Delete transaction |

#### Create Transaction Request Body
```json
{
  "amount": 50000,
  "type": "expense",
  "category": "Office Rent",
  "date": "2025-04-01",
  "notes": "April rent paid"
}
```

#### Filtering Transactions
```
GET /api/transactions?type=expense
GET /api/transactions?category=Salaries
GET /api/transactions?startDate=2025-01-01&endDate=2025-03-31
GET /api/transactions?type=expense&startDate=2025-01-01&endDate=2025-03-31
```

---

### Dashboard Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/dashboard/summary | All | Total income, expense, net balance |
| GET | /api/dashboard/categories | All | Category wise breakdown |
| GET | /api/dashboard/trends | All | Monthly income and expense trends |
| GET | /api/dashboard/recent | All | Recent transactions |

#### Optional Query Parameters
```
GET /api/dashboard/categories?type=expense
GET /api/dashboard/recent?limit=10
```

---

## Response Examples

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": "64f1a2b3...",
    "name": "Super Admin",
    "email": "admin@techcorp.com",
    "role": "admin",
    "status": "active"
  }
}
```

### Dashboard Summary Response
```json
{
  "success": true,
  "data": {
    "totalIncome": 500000,
    "totalExpense": 220000,
    "netBalance": 280000,
    "status": "profit"
  }
}
```

### Monthly Trends Response
```json
{
  "success": true,
  "data": [
    {
      "year": 2025,
      "month": 1,
      "income": 200000,
      "expense": 500000,
      "net": -300000,
      "status": "loss"
    },
    {
      "year": 2025,
      "month": 2,
      "income": 800000,
      "expense": 300000,
      "net": 500000,
      "status": "profit"
    }
  ]
}
```

### Category Breakdown Response
```json
{
  "success": true,
  "data": [
    { "category": "Salaries", "total": 1500000, "count": 1 },
    { "category": "Office Rent", "total": 200000, "count": 2 },
    { "category": "Marketing", "total": 100000, "count": 3 }
  ]
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Amount must be a positive number",
    "Type must be income or expense"
  ]
}
```

### Access Denied Response
```json
{
  "success": false,
  "message": "Access denied. Only admin can perform this action"
}
```

---

## Authentication

This API uses JWT Bearer token authentication.
```
1. Login via POST /api/auth/login
2. Copy the token from response
3. Add token to all protected routes:
   Authorization: Bearer your_token_here
4. Token expires after 7 days
5. Login again to get new token
```

---

## Default Admin Credentials
```
Email    : admin@techcorp.com
Password : admin123
```

---

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request or invalid input |
| 401 | Not authorized or invalid token |
| 403 | Forbidden or insufficient role |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Assumptions Made

- No self registration. Only admin can create user accounts.
- Admin account is created once via seed script.
- Admin cannot be deleted to prevent system lockout.
- Transaction date represents when money actually moved not when record was created.
- Negative net balance indicates company is in loss for that period.
- All amounts are stored as plain numbers in database.
- Soft delete is not implemented. Deletion is permanent.
- Password comparison logic lives in user model as a method for clean separation of concerns.

---

## Future Improvements

- Pagination for transaction listing
- Search transactions by notes or description
- Soft delete functionality
- Rate limiting
- Unit and integration tests
- API documentation with Swagger
- Password reset functionality
- Refresh token implementation



