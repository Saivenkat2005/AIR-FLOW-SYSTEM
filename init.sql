-- Database Initialization Script for Persistent Airways

CREATE DATABASE IF NOT EXISTS `airlines`;
USE `airlines`;

-- 1. Create Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` INT AUTO_INCREMENT,
  `authority` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` BIGINT AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `user_email` VARCHAR(255) NOT NULL,
  `user_phno` VARCHAR(10) NOT NULL,
  `password` VARCHAR(255) NOT NULL DEFAULT '$2a$10$eACCYoNOHEqgkVE8aI.E7OHo7b9sN.R05vYyZkW3x3990M/6h38bK',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Create User-Role Junction Table
CREATE TABLE IF NOT EXISTS `user_role_junction` (
  `user_id` BIGINT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_junction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_junction_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Create Flight Table
CREATE TABLE IF NOT EXISTS `flight` (
  `flight_id` BIGINT AUTO_INCREMENT,
  `flight_name` VARCHAR(255) NOT NULL,
  `take_off_time` VARCHAR(255) NOT NULL,
  `arrival_time` VARCHAR(255) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  `aircraft_type` VARCHAR(255) NOT NULL,
  `total_capacity` BIGINT NOT NULL DEFAULT 0,
  `confirmed_count` BIGINT NOT NULL DEFAULT 0,
  `status` VARCHAR(255) NOT NULL DEFAULT 'SCHEDULED',
  PRIMARY KEY (`flight_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Create Seat Details Table
CREATE TABLE IF NOT EXISTS `seat_details` (
  `seat_id` BIGINT AUTO_INCREMENT,
  `flight_id` BIGINT NOT NULL,
  `seat_type` VARCHAR(255) NOT NULL,
  `available_seats` BIGINT NOT NULL DEFAULT 0,
  `price` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`seat_id`),
  CONSTRAINT `fk_seat_flight` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Create Booking Table
CREATE TABLE IF NOT EXISTS `booking` (
  `booking_id` BIGINT AUTO_INCREMENT,
  `customer_id` BIGINT NOT NULL,
  `flight_id` BIGINT NOT NULL,
  `seat_type` VARCHAR(255) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  `date` VARCHAR(255) NOT NULL,
  `nop` BIGINT NOT NULL DEFAULT 1,
  `total_price` BIGINT NOT NULL DEFAULT 0,
  `pnr` VARCHAR(255) DEFAULT NULL,
  `ticket_email_status` VARCHAR(255) DEFAULT 'CONFIRMED',
  PRIMARY KEY (`booking_id`),
  CONSTRAINT `fk_booking_flight` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. Create Manifest Record Table
CREATE TABLE IF NOT EXISTS `manifest_record` (
  `id` BIGINT AUTO_INCREMENT,
  `flight_id` BIGINT NOT NULL,
  `booking_id` BIGINT NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_manifest_flight` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_manifest_booking` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 8. Create Bump Compensation Table
CREATE TABLE IF NOT EXISTS `bump_compensation` (
  `id` BIGINT AUTO_INCREMENT,
  `flight_id` BIGINT NOT NULL,
  `booking_id` BIGINT NOT NULL,
  `compensation_amount` DOUBLE NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_bump_flight` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bump_booking` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- INDEXES FOR PERFORMANCE
CREATE INDEX `idx_flight_origin_dest` ON `flight` (`origin`, `destination`);
CREATE INDEX `idx_seat_flight_type` ON `seat_details` (`flight_id`, `seat_type`);
CREATE INDEX `idx_booking_customer` ON `booking` (`customer_id`);

-- SEED DATA
-- Seed Roles
INSERT INTO `roles` (`role_id`, `authority`) VALUES
(1, 'ADMIN'),
(2, 'MANAGER'),
(3, 'USER')
ON DUPLICATE KEY UPDATE `authority`=VALUES(`authority`);

-- Seed Users/Passengers (Password for all is: password123)
INSERT INTO `users` (`user_id`, `username`, `user_email`, `user_phno`, `password`) VALUES
(1, 'admin', 'admin@persistent.com', '9876543210', '$2a$10$e395vcyPy9.lUdUTG1ToDubtAposd7TjOEH0PoCc17FmEZ0LdJ966'),
(2, 'manager', 'manager@persistent.com', '9876543211', '$2a$10$e395vcyPy9.lUdUTG1ToDubtAposd7TjOEH0PoCc17FmEZ0LdJ966'),
(3, 'passenger', 'passenger@persistent.com', '9876543212', '$2a$10$e395vcyPy9.lUdUTG1ToDubtAposd7TjOEH0PoCc17FmEZ0LdJ966')
ON DUPLICATE KEY UPDATE `username`=VALUES(`username`);

-- Seed User-Role Junction
INSERT INTO `user_role_junction` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2),
(3, 3)
ON DUPLICATE KEY UPDATE `role_id`=VALUES(`role_id`);

-- Seed Flights (Airports are NYC, LAX, DEL, BOM, LHR)
INSERT INTO `flight` (`flight_id`, `flight_name`, `take_off_time`, `arrival_time`, `origin`, `destination`, `aircraft_type`, `total_capacity`, `confirmed_count`, `status`) VALUES
(1, 'PA-101', '2026-07-04T08:00:00', '2026-07-04T11:00:00', 'New York (JFK)', 'Los Angeles (LAX)', 'Boeing 777', 150, 0, 'SCHEDULED'),
(2, 'PA-202', '2026-07-05T14:30:00', '2026-07-06T02:00:00', 'London (LHR)', 'New Delhi (DEL)', 'Airbus A350', 250, 0, 'SCHEDULED'),
(3, 'PA-303', '2026-07-06T20:15:00', '2026-07-06T22:30:00', 'Mumbai (BOM)', 'Bangalore (BLR)', 'Boeing 737', 180, 0, 'SCHEDULED')
ON DUPLICATE KEY UPDATE `flight_name`=VALUES(`flight_name`);

-- Seed Seat Details
INSERT INTO `seat_details` (`seat_id`, `flight_id`, `seat_type`, `available_seats`, `price`) VALUES
(1, 1, 'Economy', 120, 150),
(2, 1, 'Business', 20, 450),
(3, 1, 'First Class', 10, 950),
(4, 2, 'Economy', 200, 400),
(5, 2, 'Business', 40, 900),
(6, 2, 'First Class', 10, 1800),
(7, 3, 'Economy', 150, 80),
(8, 3, 'Business', 20, 250),
(9, 3, 'First Class', 10, 500)
ON DUPLICATE KEY UPDATE `available_seats`=VALUES(`available_seats`);

-- Seed Bookings
INSERT INTO `booking` (`booking_id`, `customer_id`, `flight_id`, `seat_type`, `origin`, `destination`, `date`, `nop`, `total_price`, `pnr`, `ticket_email_status`) VALUES
(1, 3, 1, 'Economy', 'New York (JFK)', 'Los Angeles (LAX)', '2026-07-04', 2, 300, 'NEXUS101', 'SENT'),
(2, 3, 2, 'Business', 'London (LHR)', 'New Delhi (DEL)', '2026-07-05', 1, 900, 'NEXUS202', 'SENT')
ON DUPLICATE KEY UPDATE `total_price`=VALUES(`total_price`);
