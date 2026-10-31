Method	Endpoint	Service	Controller	Purpose	Auth	Used By Frontend
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
