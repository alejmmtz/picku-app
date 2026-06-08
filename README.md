<img width="410" alt="PickU Logo" src="https://github.com/user-attachments/assets/a2329096-025e-4272-a3dd-09a4fde1b2f4" />

# Local Products One Tap Away

> Connecting university entrepreneurs with their consumers intelligently.

**PickU** is a platform designed for university ecosystems. It enables student entrepreneurs to manage their products, receive real-time orders, and optimize deliveries through AI-driven recommendations.

## Features

* **🏪 Entrepreneur Marketplace:** Personalized profiles for every student business with geolocation support.
* **🤖 AI Recommendations:** Smart suggestions based on natural language prompts from the consumer.
* **🛒 Order Management:** Full workflow from `Pending` to `Completed`, including security codes to ensure successful delivery.
* **📍 Geolocation:** Distance and estimated time calculations between the consumer and the delivery point.
* **📱 Responsive Design:** A seamless experience across mobile devices.

<br/>

<img width="400" alt="PickU App Preview" src="https://github.com/user-attachments/assets/314e3887-496b-4fdd-98b4-55b82fdb31bc" />

<br/>

## ⚙️ How It Works

<div align="center">
<pre>
User logs in        →        Role detected
        ↓
Entrepreneur        →        Creates business        →        Adds products
        ↓
Consumer            →        Explores                →        Places order
        ↓
System              →        Calculates distance     →        Sends order
        ↓
Real-time updates   →        Pickup                  →        Completed
        ↓
AI                  →        Recommends products
</pre>
</div>

## App Development

| Component    | Technology              |
| :----------- | :---------------------- |
| **Frontend** | React.js + Tailwind CSS |
| **Backend**  | Node.js + Express       |
| **Database** | PostgreSQL + Supabase   |
| **AI**       | OpenAI API / Groq API   |
| **Maps**     | Google Maps API         |

<br/>

## 📂 Project Structure

```text
picku-app/
|-- client/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- config/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |   |-- auth/
|   |   |   |-- consumer/
|   |   |   |-- entrepreneur/
|   |   |   `-- role-selector/
|   |   |-- providers/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   `-- utils/
|   |-- public/
|   `-- package.json
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- features/
|   |   |   |-- auth/
|   |   |   |-- chatbot/
|   |   |   |-- entrepreneurs/
|   |   |   |-- order/
|   |   |   `-- product/
|   |   |-- middlewares/
|   |   |-- shared/
|   |   |-- types/
|   |   `-- app.ts
|   `-- package.json
|-- package.json
`-- README.md
```

---

<br/>

## 📊 Data Model

PickU’s core is built on a relational schema:

<img width="100%" alt="Supabase Schema" src="https://github.com/user-attachments/assets/5ce74c2e-6909-42e7-a832-69bc7cc05d8e" />

> **Note:** The schema includes role validations (`consumer`, `entrepreneur`) and order status transitions.

---

<br/>

## 🚀 Installation & Setup

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/alejmmtz/picku-app
cd picku-app
```

### 2. Install and Run the Backend

```bash
cd server
npm i
npm run dev
```

> Before running the backend, make sure your database credentials are configured in `server/.env`.

### 3. Install and Run the Frontend

```bash
cd ../client
npm i
npm run dev
```

---

<br/>

## 🔐 Environment Variables

### Client

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:3015
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### Server

Create a `.env` file inside the `server` folder:

```env
PORT=3015
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

---

<br/>

## 🗺 Development Roadmap

### Phase 1: Foundation

* [x] **Initial Database Schema Design:** Defining entities for users, entrepreneurs, products, and orders.

### Phase 2: First Backend Build

* [x] **Milestone 2.1:** Server scaffolding with Node.js, Express, and Supabase connection.
* [x] **Milestone 2.2:** Implementation of user and entrepreneur basic REST endpoints.
* [x] **Milestone 2.3:** Core product CRUD logic: create, read, update, and delete.

### Phase 3: Frontend Development

* [x] **Milestone 3.1:** Project initialization with React and Tailwind CSS configuration.
* [x] **Milestone 3.2:** Component library setup: Navbar, Sidebar, Button, and Input.
* [x] **Milestone 3.3:** Marketplace view, product grid, and entrepreneur profile pages.

### Phase 4: Authentication & Security

* [x] **Supabase Auth Integration:** Implementation of JWT-based login, signup, and protected routes.
* [x] **Role-Based Access Control:** Restricting actions for consumers and entrepreneurs.

### Phase 5: Second Backend Build & Integration

* [x] **Order Management System:** Logic for handling order flows and status transitions.
* [x] **Geolocation Services:** Integration with Google Maps API for distance and ETA calculations.
* [x] **AI Recommendation Engine:** Integration of AI services to process natural language consumer prompts.

### Phase 6: Testing & Quality Assurance

* [x] **First Integration Test:** End-to-end flow from product creation to order completion.
* [x] **API Load Testing:** Ensuring the backend handles concurrent requests efficiently.
* [x] **Bug Bash:** Fixing UI/UX inconsistencies and edge cases.

### Phase 7: Deployment & Launch

* [x] **CI/CD Pipeline:** Setting up automated deployments with Vercel and GitHub Actions.
* [x] **Beta Release:** Deploying the first live version for university user testing.
* [x] **Production Monitoring:** Setting up logging and error tracking.

---

<br/>

## 👥 Authors

This project was developed by:

* Natalia Ordóñez
* Jorge Vasco
* Alejandro Muñoz

---

<br/>

## 📌 Academic Disclaimer

This project was developed for academic purposes as part of a university course.

---

<br/>

## ✉️ More

Behance Link: [PickU Behance](https://www.behance.net/gallery/246129701/PickU-UIFrontend)
