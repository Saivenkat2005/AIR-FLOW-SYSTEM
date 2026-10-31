# Detailed Project Workflow & Code Explanation

Welcome to the Airline Booking System! This document is written for someone with **zero knowledge** of programming or system architecture. It will explain exactly how the project works, from a high-level overview down to a line-by-line breakdown of a crucial code file.

---

## 1. What Does This Project Do?

This project is an **Airline Booking System (Aerofast)**. It allows users to:

- Search for flights.
- Book tickets.
- Pay for bookings.
- Check-in to flights.
  Administrators can manage flights, planes, and view statistics.

---

## 2. Architecture & Workflow (How it all connects)

Imagine the project like a large restaurant.

### **The Frontend (The Dining Area)**

This is what the user sees (React, Tailwind CSS). It's where the customer looks at the menu and places an order. When a user clicks "Search Flights," the Frontend takes that request and sends it to the back.

### **The API Gateway (The Head Waiter)**

The Frontend doesn't talk directly to the kitchen. It talks to the **API Gateway** (running on port `4000`). The Gateway's job is to take the customer's request and figure out which specific part of the kitchen needs to handle it.

### **The Backend Microservices (The Kitchen Stations)**

Instead of one giant kitchen doing everything, this project uses **Microservices**. Different small kitchens handle specific tasks:

- **Flight Service:** Handles flight schedules.
- **Booking Service:** Handles reserving a seat.
- **User Service:** Handles user accounts and passwords.
- **Payment Service:** Handles money.
- **AI Service:** A specialized Python service (port `8000`) likely used for smart features (like dynamic pricing or recommendations).

### **The Database (The Pantry & Fridge)**

When a service needs to save or look up data (like "What flights are available?"), it talks to:

- **MySQL Database:** The main permanent storage for all data.
- **Redis:** A super-fast temporary memory cache for things we need to access very quickly.

### **Message Broker (The Communication System)**

- **Kafka & Zookeeper:** Sometimes, one kitchen station needs to tell another station something happened without waiting around. E.g., when a booking is made, the Booking Service drops a message into Kafka saying "Booking confirmed," and the Notification Service picks that message up later to send an email.

---

## 3. The Data Flow (A Step-by-Step Example)

What happens when you search for a flight?

1. **User Action:** You open the website in your browser (Frontend) and type "New York to London".
2. **Request Sent:** The Frontend sends an HTTP Request (a digital message) over the internet to the **API Gateway**.
3. **Routing:** The API Gateway looks at the request and says, "Ah, this is a flight search. I'll send this to the Flight Service."
4. **Processing (Backend):** The Flight Service receives the request.
5. **Database Query:** The Flight Service asks the **MySQL Database**, "Do we have flights from NY to London?"
6. **Response:** MySQL replies with the flight data.
7. **Return Journey:** The Flight Service gives the data to the API Gateway -> API Gateway gives it to the Frontend -> Frontend displays the flight list nicely on your screen!

---

## 4. Line-by-Line Code Explanation

Let's look at a real file from your backend: `FlightController.java`.
A **Controller** is the exact entry point in the Backend that receives requests from the API Gateway.

Here is every single line explained:

```java
1: package com.airlines.controller;
```

**Explanation:** This line organizes the code. It says this file belongs in the "folder" (package) named `com.airlines.controller`. It's like putting a document in a specific filing cabinet.

```java
3: import org.springframework.web.bind.annotation.*;
5: import com.airlines.entity.Flight;
6: import com.airlines.service.FlightService;
8: import jakarta.validation.Valid;
10: import java.util.List;
```

**Explanation:** These are "imports". Your code is borrowing tools and blueprints written by others or from other parts of your project. For example, importing `List` gives you the ability to create lists of items.

```java
12: @RestController
```

**Explanation:** This is an "Annotation". It tells the Spring Boot framework: "Hey, this class is a web controller! It's going to listen for incoming web requests and send back data."

```java
13: @RequestMapping("/flights")
```

**Explanation:** This sets the base URL for this controller. Any request coming to `yourwebsite.com/flights` will be directed here.

```java
14: @CrossOrigin("*")
```

**Explanation:** This is a security setting. `*` means "allow anyone from any website to ask for this data." This allows your Frontend React app (which might be running on a different port) to talk to this Backend.

```java
15: public class FlightController {
```

**Explanation:** This defines the start of our main block of code. `public` means other parts of the program can access it. `class` means it's a blueprint.

```java
17:     private final FlightService flightService;
```

**Explanation:** This creates a space to hold a reference to the `FlightService`. The controller's job is just to receive traffic; the `FlightService` does the actual heavy lifting (business logic).

```java
19:     public FlightController(FlightService flightService) {
20:         this.flightService = flightService;
21:     }
```

**Explanation:** This is a "Constructor". When the program starts, it automatically builds this Controller and hands it the `FlightService` it needs to do its job.

```java
23:     @PostMapping("/add")
```

**Explanation:** This means "When someone sends an HTTP POST request to `/flights/add`, run the function below." POST is usually used for creating new things.

```java
24:     public Flight insertFlight(@Valid @RequestBody Flight flight) {
```

**Explanation:** This defines a function named `insertFlight`.

- `@RequestBody Flight flight` means: "Take the JSON data the user sent, and convert it into a `Flight` object in Java."
- `@Valid` means: "Check if the flight data is correct before proceeding (e.g., ensure the price isn't negative)."

```java
25:         System.out.println("Here");
```

**Explanation:** This just prints "Here" to the server's console logs. It's a debugging tool the developer left to see if this code was running.

```java
26:         return flightService.insertFlight(flight);
27:     }
```

**Explanation:** The controller hands the `flight` object off to the `FlightService` to save it in the database. Whatever the service replies with (likely the saved flight), it returns back to the user.

```java
29:     @GetMapping("/all")
30:     public List<Flight> getAllFlights() {
31:         return flightService.getAllFlights();
32:     }
```

**Explanation:** If a user makes a GET request to `/flights/all`, this function runs. It asks the `FlightService` for a `List` of all flights and returns them. GET is used for reading data.

```java
34:     @GetMapping("/all/{flightId}")
35:     public Flight getFlightById(@PathVariable("flightId") Long flightId) {
36:         return flightService.getFlightById(flightId);
37:     }
```

**Explanation:** If a user requests `/flights/all/105` (where 105 is the ID), `@PathVariable` grabs the "105" from the URL and passes it into the function. It then returns the details for just that one flight.

```java
39:     @DeleteMapping("/delete/{flightId}")
40:     public String deleteFlightById(@PathVariable("flightId") Long flightId) {
41:         flightService.deleteFlightById(flightId);
42:         return "Flight record deleted";
43:     }
```

**Explanation:** A DELETE request to `/flights/delete/105` runs this. It tells the service to delete flight 105, and then sends a text message back to the user saying "Flight record deleted".

```java
45:     @PutMapping("/update")
46:     public Flight updateFlightById(@Valid @RequestBody Flight flight) {
47:         return flightService.updateFlightById(flight, flight.getFlightId());
48:     }
49: }
```

**Explanation:** A PUT request to `/flights/update` runs this. PUT is used for modifying existing data. It takes the updated flight info from the user and tells the service to update it in the database. The `}` at the end closes the Controller class.

---

This should give you a foundational understanding of your project!
