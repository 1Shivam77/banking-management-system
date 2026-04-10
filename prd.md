# **Product Requirements Document (PRD)**

**Project Name:** Web-Based Bank Management System & ATM Simulator
**Document Version:** 2.0
**Status:** Approved

## **1. Introduction**

### **1.1 Purpose**

This document outlines the product requirements for a web-based Bank Management System. It details the functional and non-functional requirements, technical stack, and user flows necessary for developing a simulated digital banking environment and an interactive Automated Teller Machine (ATM) web interface.

### **1.2 Scope**

The application will transition from a traditional desktop utility to a modern client-server web application. It allows users to simulate opening a bank account via a multi-step web form, generating a unique debit card number and PIN. Post-registration, users can log into a simulated ATM web dashboard to perform standard financial transactions via RESTful API calls, including deposits, withdrawals, PIN changes, and statement generation.

### **1.3 Target Audience**

* **Computer Science Students/Bootcamp Grads:** Seeking a full-stack portfolio project.
* **Developers:** Looking to demonstrate proficiency in integrating React with a Spring Boot REST API and MySQL database.

## **2. User Personas**

* **The New Applicant:** A user who does not have an account and needs to navigate the web-based registration process to obtain a Card Number and PIN.
* **The Account Holder:** A returning user who uses their Card Number and PIN to access the secure ATM web dashboard for daily transactions.

## **3. Functional Requirements**

### **3.1 Authentication & Authorization**

| Feature | Description | Priority |
|---|---|---|
| **Login Portal** | Web form requiring a 16-digit Card Number and a 4-digit PIN. | High |
| **Secure Input** | The PIN field must use <input type="password"> to mask characters. | High |
| **Session Management** | Successful login should issue a JWT (JSON Web Token) to maintain user session state across API requests. | High |
| **Form Validation** | Client-side (React) and server-side (Spring Boot) validation for incorrect credentials, with clear error messages. | Medium |

### **3.2 Account Registration (Sign-Up Flow)**

The sign-up process is built as a multi-step React wizard component.

| Step | Data Collected | UI Elements (React) |
|---|---|---|
| **1. Personal Details** | Name, Father's Name, DOB, Gender, Email, Marital Status, Address, City, Pin Code, State. | HTML Inputs, Radio buttons, HTML5 Date Picker. |
| **2. Additional Details** | Religion, Category, Income, Education, Occupation, PAN, Aadhaar, Senior Citizen status. | Select dropdowns, Text inputs, Radio buttons. |
| **3. Account Details** | Account Type (Saving, Current), Services Required (ATM, Mobile Banking). | Checkboxes, Submit/Cancel buttons. |
| **Auto-Generation** | Backend generates a 16-digit Card Number and 4-digit PIN upon REST API POST success. | React Modal/Pop-up displaying credentials. |

### **3.3 ATM Simulator Operations (Web Dashboard)**

Once authenticated via JWT, the user accesses the protected ATM dashboard route.

* **Deposit:** Users input a numerical value. React sends a PUT or POST request to the Spring Boot API, updating the MySQL balance immediately.
* **Cash Withdrawal:** Users enter custom amounts.
  * *Validation rule:* The Spring Boot backend must verify the current balance. If withdrawal > balance, the API returns a 400 Bad Request, and React displays an "Insufficient Balance" toast notification.
* **Fast Cash:** Quick-action buttons for pre-defined denominations (e.g., Rs. 500, 1000, 5000).
* **Balance Inquiry:** Fetches and displays the exact current balance via a GET request.
* **PIN Change:** A secure form requiring the old PIN, new 4-digit PIN, and confirmation PIN before sending the update request.
* **Mini Statement:** An API endpoint returns an array of the last N transactions. React renders a digital "receipt" UI displaying:
  * Date and exact Timestamp.
  * Transaction type (Deposit/Withdrawal) and amount.
  * Current total balance.

## **4. Non-Functional Requirements**

### **4.1 UI/UX Guidelines**

* **Responsiveness:** The frontend must be fully responsive, accessible on both desktop browsers and mobile devices.
* **Design System:** Use CSS3 or a utility framework like Tailwind CSS to create an intuitive, modern interface that visually nods to an ATM screen (e.g., distinct action buttons, clear typography).
* **State Management:** Use React Hooks (useState, useEffect, useContext) or Redux to handle application state and user data seamlessly.

### **4.2 Security & Performance**

* **Password Hashing:** Spring Security must use BCrypt to hash the PIN before storing it in MySQL. Plaintext PINs must never be stored.
* **CORS:** The Spring Boot backend must be configured to accept Cross-Origin Resource Sharing (CORS) requests specifically from the React frontend domain.
* **API Response Time:** REST API endpoints should respond in under 500ms to ensure a snappy user experience.

## **5. Technical Architecture**

### **5.1 Technology Stack**

* **Frontend (Client):** HTML5, CSS3, JavaScript (React.js)
* **Backend (Server):** Java, Spring Boot, Spring Web, Spring Security
* **Database:** MySQL Server
* **ORM:** Spring Data JPA / Hibernate (for mapping Java objects to MySQL tables)
* **API Paradigm:** RESTful APIs

### **5.2 High-Level Database Schema (MySQL / Spring Data Entities)**

 1. **Users (Entity):** Maps to personal and additional details. Columns: id, name, email, dob, pan, aadhaar, etc.
 2. **Accounts (Entity):** Maps to banking details. Columns: account_no, card_number (Unique, Indexed), pin_hash, balance, user_id (Foreign Key).
 3. **Transactions (Entity):** Maps to the mini-statement. Columns: transaction_id, account_id (Foreign Key), timestamp, type (ENUM: DEPOSIT, WITHDRAWAL), amount.

## **6. Pre-Launch Readiness Checklist**

### **Legal & Compliance**

* [ ] Privacy Policy page
* [ ] Terms & Conditions (Terms of Service)
* [ ] Cookie consent (especially if targeting EU — GDPR)

### **Auth & Security**

* [ ] Signup / login flow tested
* [ ] Email verification working
* [ ] Password reset flow
* [ ] OAuth (Google, etc.) working if included
* [ ] Rate limiting (prevent brute force on login endpoints)

### **Payment** *(Note: If integrating real gateways like Stripe/Razorpay in the future)*

* [ ] Payment flow fully tested (success + fail)
* [ ] Subscription lifecycle:
  * [ ] upgrade
  * [ ] downgrade
  * [ ] cancel

### **Analytics & Tracking**

* [ ] User Event Tracking (e.g., tracking how often "Fast Cash" is used via Google Analytics or custom backend logs)
* [ ] Page Tracking (React Router tracking)

### **Marketing Basics**

* [ ] Submit page to Google Search Console
* [ ] Submit on other search engines
* [ ] Check for SEO Basics (Meta tags in React index.html)

### **Feedback Loop**

* [ ] Contact/Support Email listed on the UI
* [ ] Bug Report option integrated into the dashboard
