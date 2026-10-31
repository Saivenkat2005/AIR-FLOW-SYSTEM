const fs = require('fs');
const path = require('path');

const dir = './audit';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// 1. AUDIT_REPORT.md
fs.writeFileSync(path.join(dir, 'AUDIT_REPORT.md'), `AIRLINE NEXUS — REPOSITORY AUDIT
================================

Audit Date: 2026-09-21
Repository: Airline-Booking 2
Branch: Local (Unknown)
Commit: Unknown
Frontend: React, Vite, Tailwind
Backend: Spring Boot, Node.js API Gateway, Python FastAPI AI Service
Database: MySQL
API Gateway: Node.js/Express Http-Proxy
Infrastructure: Redis, Kafka, Zookeeper, Loki, Tempo, Prometheus, Grafana
Docker: Docker Compose (V2)
Overall Status: Functional Monolith Transitioning to Microservices

Critical Issues:
AUD-001: TLS network timeouts causing Docker Hub pulls to fail (Mitigated via retry_pull.ps1 script)

High Issues:
AUD-002: Docker container naming conflicts due to COMPOSE_PROJECT_NAME changes
AUD-003: Redis and Kafka dependencies block local development if not properly profiled.

Medium Issues:
AUD-004: CSS Glassmorphism class name mismatch (.nexus-panel vs .nexus-surface) resolved.

Low Issues:
AUD-005: Pixabay API key not configured, defaulting to blank string.

Modification Risk: Medium (Docker orchestration handles most complexity).
`);

// 2. repository-tree.txt
fs.writeFileSync(path.join(dir, 'repository-tree.txt'), `airline-nexus/
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Service/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile [FRONTEND]
├── backend/
│   ├── airlines/ (core-service) [BACKEND]
│   │   ├── src/main/java/com/airlines/
│   │   ├── pom.xml
│   │   └── Dockerfile
├── backend-nexus/
│   ├── api-gateway/ [API]
│   │   ├── server.js
│   │   └── Dockerfile
│   ├── flight-service/ (Pending extraction)
│   ├── booking-service/ (Pending extraction)
│   ├── user-service/ (Pending extraction)
│   ├── seat-service/ (Pending extraction)
│   └── ...
├── ai-service/
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
├── config/
│   ├── prometheus/ [CONFIG]
│   └── grafana/ [CONFIG]
├── docker-compose.yml [DOCKER]
├── .env [CONFIG] [SECURITY]
├── retry_pull.ps1
└── README.md
`);

// 3. technology-inventory.md
fs.writeFileSync(path.join(dir, 'technology-inventory.md'), `Layer	Technology	Version	Evidence/File	Status
Frontend	React	^18.2.0	Frontend/package.json	✓
Build	Vite	^4.5.1	Frontend/package.json	✓
Backend	Spring Boot	3.1.5	Backend/airlines/pom.xml	✓
Java	Java	21	Backend/airlines/Dockerfile	✓
Gateway	Node.js/Express	^4.18.2	Backend-Nexus/api-gateway/package.json	✓
Database	MySQL	8.0	docker-compose.yml	✓
Cache	Redis	7-alpine	docker-compose.yml	✓
Messaging	Kafka	7.4.0	docker-compose.yml	✓
Container	Docker	V2	docker-compose.yml	✓
AI Service	Python FastAPI	0.104.1	ai-service/requirements.txt	✓
`);

// 4. frontend-audit.md
fs.writeFileSync(path.join(dir, 'frontend-audit.md'), `Framework: React
React version: ^18.2.0
TypeScript/JavaScript: JavaScript
Vite/CRA/other: Vite
package manager: npm
build scripts: vite build
Application Entry: src/main.jsx

Main entry: src/main.jsx
Root component: App.jsx
Routing configuration: react-router-dom in App.jsx
Global CSS: index.css
Theme system: CSS variables + Custom Glassmorphism (.nexus-surface, .spatial-card)
API client: axios (Service/apiCalls.js)
State management: React Context/Hooks

Pages:
 /
 /search (via Dashboard)
 /flight-details (Modal/Component)
 /seats (via Component)
 /booking
 /payment
 /admin

Components:
FlightSearch
FlightCard
SeatMap
BookingSummary
Payment
AdminDashboard
UserDashboard

CSS:
Total CSS files: 1 (index.css)
Approximate CSS size: Medium
Duplicate styling detected: Minimal
Unused styling detected: Minimal
Hardcoded colors: Replaced with design tokens
!important usage: Minimal
Responsive rules: Standard media queries
Animation system: CSS transitions/keyframes
`);

// 5. backend-audit.md
fs.writeFileSync(path.join(dir, 'backend-audit.md'), `Service: Core Service
Port: 8080
Framework: Spring Boot
Entry point: AirlinesApplication.java
Database: MySQL
Dependencies: Spring Web, Spring Data JPA, Kafka, Redis, Actuator, Micrometer
REST APIs: Flight, Booking, User, Seat, Payment, Auth
Messaging: Kafka Producer/Consumer
Cache: RedisTemplate for Seat Locking
Docker image: air-ai-core-service

Service: API Gateway
Port: 4000
Framework: Node.js / Express
Entry point: server.js
Dependencies: http-proxy-middleware, express-rate-limit, cors, helmet
Docker image: air-ai-api-gateway

Service: AI Service
Port: 8000
Framework: Python FastAPI
Docker image: air-ai-ai-service

Spring Boot Architecture:
@SpringBootApplication: Yes
Controllers: Auth, Booking, Flight, Payment, Seat, User
Services: Extracted Interfaces and Impls
Repositories: Spring Data JPA
Entities: Flight, Booking, User, Seat, Payment
DTOs: Present
Configurations: SecurityConfig, RedisConfig, KafkaConfig
Security configuration: Spring Security + JWT
Exception handlers: GlobalExceptionHandler

Business Domains:
Flight: Yes
Airport: Yes
Seat: Yes
Booking: Yes
Passenger: Yes
Payment: Yes
User: Yes
Admin: Yes
Authentication: Yes
Authorization: Yes
`);

// 6. api-inventory.md
fs.writeFileSync(path.join(dir, 'api-inventory.md'), `Method	Endpoint	Service	Controller	Purpose	Auth	Used By Frontend
POST	/auth/register	core-service	AuthController	Register User	No	Yes
POST	/auth/login	core-service	AuthController	Login User	No	Yes
GET	/flights/all	core-service	FlightController	Get all flights	No	Yes
POST	/flights/add	core-service	FlightController	Add flight	Yes	Yes
DELETE	/flights/delete/{id}	core-service	FlightController	Delete flight	Yes	Yes
PUT	/flights/update	core-service	FlightController	Update flight	Yes	Yes
POST	/booking/add	core-service	BookingController	Create booking	Yes	Yes
GET	/booking/get/{userId}	core-service	BookingController	Get user bookings	Yes	Yes
GET	/booking/get	core-service	BookingController	Get all bookings	Yes	Yes
DELETE	/booking/delete/{id}	core-service	BookingController	Delete booking	Yes	Yes
PUT	/booking/update	core-service	BookingController	Update booking	Yes	Yes
GET	/seat/getseats/{flightId}	core-service	SeatController	Get seats for flight	Yes	Yes
POST	/seat/add	core-service	SeatController	Add seat	Yes	Yes
PUT	/seat/update	core-service	SeatController	Update seat	Yes	Yes
DELETE	/seat/delete/{id}	core-service	SeatController	Delete seat	Yes	Yes
GET	/user/getallusers	core-service	UserController	Get all users	Yes	Yes
GET	/user/userbyid/{id}	core-service	UserController	Get user	Yes	Yes
PUT	/user/update	core-service	UserController	Update user	Yes	Yes
DELETE	/user/delete/{id}	core-service	UserController	Delete user	Yes	Yes
POST	/api/checkin/{id}	core-service	BookingController	Check-in	Yes	Yes
POST	/api/ai/chat	ai-service	Router	AI Chatbot	No	Yes
GET	/api/ai/health	ai-service	Router	Health Check	No	No

API Gateway routes: /api -> 8080, /api/ai -> 8000
CORS configuration: Yes
authentication headers: Bearer Token
JWT/session handling: JWT
timeouts: Default
rate limiting: Configured in API Gateway
`);

// 7. database-audit.md
fs.writeFileSync(path.join(dir, 'database-audit.md'), `Database
DB engine: MySQL
DB version: 8.0
Database name: flightdb
Host: nexus_mysql
Port: 3306
Docker container: nexus_mysql

Tables / Entities
users
flights
seats
bookings
payments (via entities)

Primary key: Id fields
Foreign keys: configured via JPA @ManyToOne
Relationships: Mapped correctly
Indexes: Standard JPA
Unique constraints: Email/Username
Nullable fields: Present
`);

// 8. seat-system-audit.md
fs.writeFileSync(path.join(dir, 'seat-system-audit.md'), `Database -> Entity -> Repository -> Service -> Controller -> API Gateway -> Frontend API client -> Seat UI -> Selection -> Locking -> Booking

Seat map retrieval: Yes
Seat availability: Yes
Seat selection: Yes
Seat deselection: Yes
Seat locking: Yes (Redis)
Seat unlock: Yes (Redis TTL)
Seat expiration: Yes
Seat ownership: Yes
Seat booking: Yes
Duplicate-seat prevention: Yes (Redis Lock)
Concurrent booking protection: Yes

MISSING: 3D Visualization System (Needs to be implemented)
Risk: High (visual overhaul)
Recommended implementation location: Frontend/src/Components/SeatMap/SeatMap3D.jsx
`);

// 9. docker-audit.md
fs.writeFileSync(path.join(dir, 'docker-audit.md'), `Images:
frontend: Node build + Nginx
api-gateway: Node alpine
core-service: Maven build + Eclipse Temurin JRE
ai-service: Python slim
mysql:8.0
redis:7-alpine
confluentinc/cp-zookeeper
confluentinc/cp-kafka
grafana/promtail, loki, tempo, prometheus, grafana

Base images: Clean
Build stages: Multi-stage
Exposed ports: 80, 4000, 8080, 8000, 3306
Volumes: mysql_data, redis_data, grafana_data, prometheus_data
Networks: public-network, internal-network, data-network

Dependency graph:
Frontend -> API Gateway -> Core Service, AI Service -> MySQL, Redis, Kafka
`);

// 10. architecture-before.md
fs.writeFileSync(path.join(dir, 'architecture-before.md'), `                  Browser
                     │
                     ▼
              React Frontend (Port 80)
                     │
                     ▼
             API Gateway (Port 4000)
                     │
              ┌──────┴──────┐
              ▼             ▼
  Core Service (8080)   AI Service (8000)
              │
        ┌─────┼─────┐
        ▼     ▼     ▼
      MySQL Redis Kafka
`);

// 11. change-impact.md
fs.writeFileSync(path.join(dir, 'change-impact.md'), `Feature	Files Affected	API Impact	DB Impact	Risk
3D Seats	Frontend/src/Components/SeatMap/*	None/New	None	Medium
Pixabay	Backend/airlines/src/.../PixabayService.java	New endpoint	None	Low
Redis fallback	Backend/airlines/.../SeatLockService.java	None	None	Medium
Kafka optional	Backend/airlines/.../KafkaConfig.java	None	None	Medium
Premium CSS	Frontend/src/index.css	None	None	Low
`);

// 12. protected-assets.md
fs.writeFileSync(path.join(dir, 'protected-assets.md'), `File: Backend/airlines/src/main/java/com/airlines/entity/*
Reason protected: Database mappings
Allowed modification: Only adding new transient fields if needed

File: Backend/airlines/src/main/java/com/airlines/security/*
Reason protected: Security rules
Allowed modification: None
`);

// 13. error-inventory.md
fs.writeFileSync(path.join(dir, 'error-inventory.md'), `ID	Layer	Error	File	Severity	Blocks Startup
ERR-001	Docker	TLS timeout on large images	network	Critical	Yes (Mitigated via powershell script)
ERR-002	Config	Missing PIXABAY_API_KEY	.env	Low	No
`);

// 14. security-baseline.md
fs.writeFileSync(path.join(dir, 'security-baseline.md'), `CORS: Configured in API Gateway and Spring Boot
Authentication: JWT
Authorization: Spring Security Role Based
Secrets: .env file used

SECURITY STATUS
Critical: 0
High: 0
Medium: 0
Low: 1 (Pixabay API Key missing from env)
Informational: 0
`);

console.log("Audit files generated successfully.");
