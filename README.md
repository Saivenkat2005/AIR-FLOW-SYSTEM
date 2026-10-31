# Persistent Airways - Flight Booking System

A premium, enterprise-grade, fully public SaaS Flight Booking System. This application has been refactored to remove all user-level authentication layers (Login, Register, JWT, Spring Security) in favor of a clean, passwordless dashboard model where all Passenger, Manager, and Admin workflows are accessible directly.

---

## 🛠 Technology Stack

- **Frontend**: React.js (Vite) + Tailwind CSS + Lucide Icons
- **Backend**: Java 21 + Spring Boot 3.x + Spring Data JPA
- **Database**: MySQL 8.0 running inside Docker
- **Orchestration**: Docker + Docker Compose

---

## 🚀 Quick Start (Production Setup)

The entire application compiles, initializes, and launches with a single command. 

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Launch Command
Run the following command at the project root directory:

```bash
docker compose down -v && docker compose up --build
```

*(Note: The `-v` flag ensures old database volumes are cleaned up so the database initializes fresh from the SQL script.)*

Once started:
- **Frontend URL**: [http://localhost](http://localhost) (mapped to Port 80)
- **Backend API URL**: [http://localhost:8080](http://localhost:8080)
- **Database Port**: `3307` (internally mapped to `3306`)

---

## 📦 Deliverables & Infrastructure

### 1. Environment Configuration (`.env`)
The `.env` file at the root contains database properties and frontend configurations:
```env
DB_HOST=mysql
DB_PORT=3306
DB_NAME=airlines
DB_USER=root
DB_PASSWORD=
VITE_API_BASE_URL=/api
```

### 2. SQL Seeding (`init.sql`)
The database schema and seeded data are automatically applied when the database container spins up using:
- **Roles table**: Populated with `ADMIN`, `MANAGER`, and `USER`.
- **Users table**: Mock Passenger accounts for direct routing/interaction.
- **Flight & Seat Details**: Seeding 3 scheduled flights with Economy, Business, and First Class seats.
- **Indexes**: Applied to `(origin, destination)` and `(flight_id, seat_type)` for quick query resolution.

---

## 🎭 Persona Switcher (Access Control)
Since passwords and login screens are removed, role-based views (Passenger search/booking, Manager flight approvals, Admin panel flight creation) are toggled dynamically on the frontend via a **Persona Switcher** in the main navigation Header:
- **Passenger Persona**: Can search flights, view available seats, select options, book tickets, and manage bookings.
- **Manager Persona**: Can review flight listings and approve or reject flight entries.
- **Admin Persona**: Exercising full controller access over flights, seat type creations, and passenger manifests.

---

## 🛰 API Documentation

All backend API endpoints are public and do not require Bearer tokens:

### ✈️ Flights API (`/flights`)
- `GET /flights/all` - Retrieve all flights.
- `GET /flights/all/{id}` - Retrieve details for a specific flight.
- `POST /flights/add` - Register a new flight (Admin).
- `PUT /flights/update` - Update flight details (Admin).
- `DELETE /flights/delete/{id}` - Remove a flight record (Admin).

### 💺 Seats API (`/seat`)
- `GET /seat/get` - Get all seat categories.
- `GET /seat/getseats/{flightId}` - Get interactive seat layout capacity for a specific flight.
- `POST /seat/add` - Add seat type class configurations (Admin).
- `PUT /seat/update` - Update seat details (Admin).
- `DELETE /seat/delete/{id}` - Remove seat configuration (Admin).

### 🎫 Bookings API (`/booking`)
- `GET /booking/get` - Fetch all bookings (Admin/Manager).
- `GET /booking/getbooking/{id}` - Retrieve a single booking details.
- `GET /booking/get/{customerId}` - Fetch bookings belonging to a specific customer profile.
- `POST /booking/add` - Book a flight seat.
- `PUT /booking/update` - Modify booking information.
- `DELETE /booking/delete/{id}` - Cancel booking record.

### 🏁 Check-In & Overbooking (`/api/checkin`)
- `POST /api/checkin/{bookingId}` - Trigger passenger check-in. Throws `OverbookedException` if flight capacity is exceeded, automatically engaging the upgrade-or-bump rebalancing engine.

---

## 🔧 Troubleshooting & FAQ

### 1. Database connection refused or failure
- Verify that no local instance of MySQL is running on port `3306` or `3307`.
- Run `docker compose down -v` to clear cached states, then rebuild.

### 2. Database Inspection (SQL Shell inside Docker)
You can inspect the running database directly through the MySQL client inside the container:
```bash
docker exec -it airlines_mysql mysql -u root
```
Once inside, query tables and schema definitions:
```sql
USE airlines;
SHOW TABLES;
SELECT * FROM flight;
SELECT * FROM users;
```

### 3. Hot-Reloading during development
For local development without Docker container overhead:
- **Backend**: Run `mvn spring-boot:run` in `Backend/airlines` (uses fallback connections to localhost:3307).
- **Frontend**: Run `npm run dev` in `Frontend` (launches Vite dev server on port 3000).

# AIR-FLOW-SYSTEM


