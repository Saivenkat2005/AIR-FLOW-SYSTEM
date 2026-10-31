Service: Core Service
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
