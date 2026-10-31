                  Browser
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
