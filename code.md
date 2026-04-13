# SecureBank — Test Login Credentials

> All accounts are **auto-seeded** on every backend startup.
> Copy-paste the Card Number and PIN directly into the login form.

---

## Administrator Login

> Toggle to **"Administrator"** tab on the Login page

| Field        | Value                    |
|-------------|--------------------------|
| **Email**    | `admin@securebank.com`   |
| **Password** | `admin123`               |

---

## Customer Test Logins

> Use **"Customer"** tab (default) on the Login page

### 1. Rajesh Kumar Mishra — Software Engineer, Patna

| Field           | Value              |
|----------------|--------------------|
| **Card Number** | `4001100120013001`  |
| **PIN**         | `1234`             |
| **Balance**     | ₹75,000            |

---

### 2. Priya Kumari Singh — Bank Manager, Patna

| Field           | Value              |
|----------------|--------------------|
| **Card Number** | `4002200220023002`  |
| **PIN**         | `5678`             |
| **Balance**     | ₹1,20,000          |

---

### 3. Amit Kumar Yadav — Shopkeeper, Muzaffarpur

| Field           | Value              |
|----------------|--------------------|
| **Card Number** | `4003300330033003`  |
| **PIN**         | `9012`             |
| **Balance**     | ₹45,000            |

---

### 4. Sneha Devi Jha — College Professor, Bhagalpur

| Field           | Value              |
|----------------|--------------------|
| **Card Number** | `4004400440044004`  |
| **PIN**         | `3456`             |
| **Balance**     | ₹2,00,000          |

---

## How to Run

```bash
# Backend (port 8080)
cd backend
./mvnw spring-boot:run

# Frontend (port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173` → pick any credentials above → login!
