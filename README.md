# 🏦 NexusBank: Web-Based ATM & Banking Management System



## 🌟 Overview
**NexusBank** is a modern, full-stack Banking Management System designed to simulate a real-world digital banking environment. It provides a seamless transition from a traditional account opening process to a sophisticated ATM simulator dashboard. Built with a robust **Spring Boot** backend and a dynamic **React** frontend, it demonstrates the integration of secure financial operations with a premium user experience.

---

## 🚀 Key Features

### 🔐 Secure Authentication
- **Multi-Factor Security**: OTP-based verification for login and sensitive operations.
- **JWT Authorization**: Session management using JSON Web Tokens.
- **PIN Encryption**: Industry-standard BCrypt hashing for secure PIN storage.

### 💳 ATM Operations
- **Dynamic Dashboard**: Real-time balance updates and transaction history.
- **Cash Management**: Withdraw and deposit funds with backend validation for insufficient balance.
- **Fast Cash**: One-click withdrawals for common denominations.
- **PIN Management**: Secure old-to-new PIN transitions.

### 📄 Financial Services
- **Mini Statement**: View the latest transactions in a digital receipt format.
- **Statement Export**: Download your transaction history as a professional **PDF report**.
- **Fund Transfers**: (Coming Soon) Seamless transfers between accounts.

### 🛠️ Administrative Control
- **Admin Portal**: Dedicated dashboard for system administrators to manage users and monitor transactions.
- **Data Seeding**: Automatic system initialization with sample accounts for testing.

---

## 💻 Tech Stack

### Frontend
- **React 19**: Modern UI component architecture.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS 4**: Premium utility-first styling.
- **Lucide Icons**: Sleek, consistent iconography.
- **Recharts**: Visualization for financial data.

### Backend
- **Spring Boot 4.x**: Robust enterprise-grade framework.
- **Spring Security**: Advanced authentication and authorization middleware.
- **Spring Data JPA**: Seamless database ORM with **Hibernate**.
- **OpenPDF**: High-fidelity PDF generation.
- **JJWT**: Secure token generation and parsing.

### Database
- **MySQL**: Relational database for persistent storage.
- **H2**: In-memory database support for rapid development/testing.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Java 17** or higher
- **Node.js 20+** and **npm**
- **Maven**
- **MySQL Server** (Optional, defaults to H2)

### Backend Setup
1. Navigate to the `backend` directory.
2. Configure `src/main/resources/application.properties` (Database credentials).
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture
The system follows a classic **Client-Server** architecture:

1. **Client Layer**: React-based Single Page Application (SPA) handling UI state and user interactions.
2. **Security Layer**: Spring Security filter chain validating JWTs and managing CORS.
3. **Service Layer**: Business logic for banking operations, OTP generation, and PDF rendering.
4. **Data Layer**: Hibernate/JPA mapping entities to the relational database schema.

---

## 🗺️ Roadmap
- [ ] **UPI-like Fund Transfers**: Real-time transfers via Card/Account number.
- [ ] **Chatbot Assistant**: AI-powered helper for quick balance checks.
- [ ] **Mobile App (PWA)**: Progressive Web App support for mobile installation.
- [ ] **Two-Factor Authentication (2FA)**: Full SMS/Email 2FA integration.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
