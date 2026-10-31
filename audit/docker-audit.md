Images:
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
