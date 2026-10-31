Database
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
