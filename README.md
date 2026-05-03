<img width="410" alt="Group 32" src="https://github.com/user-attachments/assets/a2329096-025e-4272-a3dd-09a4fde1b2f4" />

# Local Products One Tap Away

> Connecting university entrepreneurs with their consumers intelligently.

**PickU** is a platform designed for university ecosystems that enables student entrepreneurs to manage their products, receive real-time orders, and optimize deliveries through AI-driven recommendations.

## Features

  * **🏪 Entrepreneur Marketplace:** Personalized profiles for every student business with geolocation support.
  * **🤖 AI Recommendations:** Smart suggestions based on natural language prompts from the consumer.
  * **🛒 Order Management:** Full workflow from `Pending` to `Completed`, including security codes to ensure successful delivery.
  * **📍 Geolocation:** Distance and estimated time calculations between the consumer and the delivery point.
  * **📱 Responsive Design:** A seamless experience across all mobile devices.

<br/>
<br/>
<br/>
    
<img width="400"  alt="Group 27" src="https://github.com/user-attachments/assets/314e3887-496b-4fdd-98b4-55b82fdb31bc" />

<br/>
<br/>
<br/>

## App Development

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js + Tailwind CSS |
| **Backend** | Node.js (Express) |
| **Database** | PostgreSQL (Supabase) |
| **AI** | OpenAI API |
| **Maps** | Google Maps API |
<br/>

## 📂 Project Structure (Monorepo)

```bash
picku-app/
├── client/          # Frontend (React)
├── server/          # Backend (REST API)
├── database/        # SQL Scripts
├── shared/          # TypeScript types or shared constants
└── docs/            # Additional documentation and diagrams
```
-----
<br/>



## 📊 Data Model

PickU’s core is built on a relational schema:

<img width="full" alt="supabase-schema-nrhcfsmopjerjgzmgmjw" src="https://github.com/user-attachments/assets/5ce74c2e-6909-42e7-a832-69bc7cc05d8e" />

> **Note:** The schema includes role validations (`consumer`, `entrepreneur`) and order status transitions.
-----

<br/>



## 🚀 Installation & Setup

Dev steps to set up the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/alejmmtz/picku-app
cd picku-app
```

### 2. Init the Backend

```bash
cd server
npm i
# Configure your DB credentials
npm run dev
```

### 3. Configure the Frontend

```bash
cd ../client
npm i
npm run dev
```

-----
<br/>

## 🗺 Roadmap de Desarrollo

### Phase 1: Foundation
- [x] **Initial Database Schema Design:** Defining entities for Users, Entrepreneurs, Products, and Orders.

### Phase 2: First Backend Build (Core API)
- [x] **Milestone 2.1:** Server scaffolding with Node.js/Express and Supabase connection.
- [x] **Milestone 2.2:** Implementation of User and Entrepreneur basic REST endpoints.
- [x] **Milestone 2.3:** Core Product CRUD logic (Create, Read, Update, Delete).

### Phase 3: Frontend Development (MVP UI)
- [ ] **Milestone 3.1:** Project initialization with React and Tailwind CSS configuration.
- [ ] **Milestone 3.2:** Component Library setup (Navbar, Sidebar, Button, and Input).
- [ ] **Milestone 3.3:** Marketplace View: Product grid and Entrepreneur profile pages.

### Phase 4: Authentication & Security
- [ ] **Supabase Auth Integration:** Implementation of JWT-based login, signup, and protected routes.
- [ ] **Role-based Access Control (RBAC):** Restricting actions for consumers vs. entrepreneurs.

### Phase 5: Second Backend Build & Integration
- [ ] **Order Management System:** Logic for handling order flows and status transitions.
- [ ] **Geolocation Services:** Integration with Google Maps API for distance and ETA calculations.
- [ ] **AI Recommendation Engine:** Integrating OpenAI API to process natural language consumer prompts.

### Phase 6: Testing & Quality Assurance
- [ ] **First Integration Test:** End-to-end flow from product creation to order completion.
- [ ] **API Load Testing:** Ensuring the backend handles concurrent requests efficiently.
- [ ] **Bug Bash:** Fixing UI/UX inconsistencies and edge cases.

### Phase 7: Deployment & Launch
- [ ] **CI/CD Pipeline:** Setting up automated deployments (Vercel/GitHub Actions).
- [ ] **Beta Release:** Deploying the first live version for university user testing.
- [ ] **Production Monitoring:** Setting up logging and error tracking.


## ✉️ More

Behance Link: [PickU Behance](https://www.behance.net/gallery/246129701/PickU-UIFrontend)
