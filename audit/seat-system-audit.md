Database -> Entity -> Repository -> Service -> Controller -> API Gateway -> Frontend API client -> Seat UI -> Selection -> Locking -> Booking

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
