# NexCart AI — Intelligent E-Commerce & Customer Analytics Platform

**Smarter Shopping. Better Decisions.**

Welcome to NexCart AI! This project is a complete, production-ready full-stack e-commerce web application. It integrates a traditional e-commerce shopping experience with an AI-driven content-based recommendation system and customer analytics.

This document serves as the complete technical documentation for the platform, explaining every folder, technology used, and the reasoning behind architectural decisions.

---

## 🏗 Architecture Overview

NexCart AI is built using a microservices-inspired architecture. By separating the frontend, core backend API, and the machine learning service, we ensure that each module scales independently and uses the best technology for its specific task.

### High-Level Flow
1. **User (Browser)** interacts with the **React Frontend**.
2. **Frontend** makes REST API calls to the **Node.js Backend**.
3. **Node.js Backend** manages authentication, business logic, and talks to the **MySQL Database**.
4. When a user views a product, the backend requests the **Python ML-Service** to generate "Recommended Products".
5. **Python ML-Service** pulls product text data from the database, runs a TF-IDF machine learning model, and returns product recommendations.

---

## 📂 Detailed Folder Structure & Tech Stack

Here is a full breakdown of every folder in this repository, why it exists, what it does, and the technology stack it uses.

### 1. `/backend` (Core API Service)
**Why it was made:** We need a robust, asynchronous server to handle user authentication, shopping cart logic, order processing, and general database interactions.
**What it does:** It exposes a RESTful API for the frontend to consume. It acts as the central hub of the application.
**Tech Stack:** JavaScript, Node.js, Express.js, MySQL2 (for DB driver), JWT (Authentication), bcrypt (Password hashing).
- **`/config`**: Contains database connection setup and environment variable configurations.
- **`/controllers`**: Contains the actual business logic for each route (e.g., `userController` for login/signup, `productController` for fetching products).
- **`/middleware`**: Functions that run before controllers. Used for JWT token validation (`authMiddleware`) to protect admin or user-specific routes.
- **`/models`**: Wrappers or query builders for interacting with specific database tables.
- **`/routes`**: Maps URL endpoints (like `/api/users/login`) to their specific controller functions.
- **`/utils`**: Helper functions (like generating tokens, custom error formatting).
- **`server.js`**: The entry point of the backend application that starts the Express server.
- **`seeder.js`**: A utility script to populate the database with dummy data (products, categories, users) for testing.

### 2. `/frontend` (User Interface)
**Why it was made:** To provide a visual, interactive experience for both customers shopping on the site and administrators managing the store.
**What it does:** Renders the website. It handles state (like what is in the cart), routing between pages, and fetching data from the backend.
**Tech Stack:** React.js, Vite (Build tool for extremely fast development), Vanilla CSS (for modern glassmorphism and custom styling), React Router.
- **`/src/assets`**: Static files like images, logos, or icons.
- **`/src/components`**: Reusable UI blocks (e.g., `Navbar`, `ProductCard`, `Footer`, `Button`).
- **`/src/pages`**: Full-page components mapped to routes (e.g., `Home`, `Cart`, `AdminDashboard`, `Login`).
- **`/src/context`**: React Context API files for global state management (e.g., `AuthContext` to know who is logged in, `CartContext` to hold cart items across pages).
- **`/src/utils`**: Helper functions for the frontend, like API calling wrappers (Axios/Fetch).
- **`App.jsx` & `main.ts`**: The root configuration and entry points for the React application.
- **`index.css` & `style.css`**: Global design tokens and styling rules.

### 3. `/ml-service` (AI Recommendation Engine)
**Why it was made:** Machine Learning tasks (like matrix operations and NLP) are computationally heavy and block the single-threaded Node.js server. Python is the industry standard for Data Science, so a separate microservice was built.
**What it does:** Provides a single API endpoint `/api/recommendations/<id>`. When called, it uses NLP (Natural Language Processing) to find products similar to the requested one based on descriptions, categories, and brands.
**Tech Stack:** Python, Flask (lightweight web framework), Pandas (Data manipulation), Scikit-Learn (Machine Learning libraries).
- **`app.py`**: The Flask server. It connects to the MySQL DB, fetches product text data, builds a TF-IDF (Term Frequency-Inverse Document Frequency) matrix, calculates Cosine Similarity, and returns the most similar product IDs.
- **`requirements.txt`**: Lists the Python dependencies required to run the service.

### 4. `/database` (Data Storage Setup)
**Why it was made:** To define the structure of the data. E-commerce platforms are highly relational (Users have Orders, Orders have Products), making a SQL database the perfect fit.
**What it does:** Holds the initialization scripts for the database.
**Tech Stack:** MySQL.
- **`schema.sql`**: A SQL script containing all the `CREATE TABLE` statements. It defines tables for `users`, `categories`, `products`, `orders`, `order_items`, and `reviews`, including all foreign key relationships and constraints.

### 5. `/docs`
**Why it was made:** A dedicated space for project documentation.
**What it does:** Will house architecture diagrams, API contract specifications (like Swagger/OpenAPI files), and any long-form technical documentation useful for developers joining the project.

### 6. Root Configuration Files
- **`docker-compose.yml`**: Automates the setup of the infrastructure. Currently used to instantly spin up a local MySQL database container with the correct credentials, saving you from installing MySQL manually.

---

## 🚀 How to Setup and Run the Project

To run this platform locally, you will need to start the Database, the Backend, the ML-Service, and the Frontend. 

### Step 1: Database (MySQL)
1. Ensure you have Docker installed.
2. In the root folder, run:
   ```bash
   docker-compose up -d
   ```
3. This starts a MySQL server on port `3306` with the database `nexcart`.
4. Apply the schema by running the `database/schema.sql` script in your SQL client, or the backend seeder script will handle initialization.

### Step 2: Backend (Node.js)
1. Open a terminal and navigate to the `backend` folder: `cd backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on your local DB setup (defaults are usually fine if using the Docker compose file).
4. (Optional) Seed the database with sample data: `node seeder.js`
5. Start the server:
   ```bash
   npm run dev
   ```
*(Runs on `http://localhost:5000`)*

### Step 3: ML-Service (Python)
1. Open a new terminal and navigate to the `ml-service` folder: `cd ml-service`
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment (Windows: `venv\Scripts\activate`, Mac/Linux: `source venv/bin/activate`).
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the Flask server:
   ```bash
   python app.py
   ```
*(Runs on `http://localhost:5001`)*

### Step 4: Frontend (React)
1. Open a new terminal and navigate to the `frontend` folder: `cd frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
*(Runs on `http://localhost:5173`)*

---

## 🔮 Why this structure is highly useful
- **Scalability**: If the recommendation engine gets heavy traffic, you can deploy multiple instances of the Python ML-service independently of the Node backend.
- **Maintainability**: Clear separation of concerns. UI developers work in `/frontend`, API developers in `/backend`, and Data Scientists in `/ml-service` without stepping on each other's toes.
- **Enterprise-Ready**: Utilizing Docker, JWTs, and isolated microservices mimics how large-scale tech companies build applications today.
