$images = @(
    "confluentinc/cp-zookeeper:7.4.0",
    "confluentinc/cp-kafka:7.4.0",
    "redis:7-alpine",
    "prom/prometheus:latest",
    "grafana/grafana:latest",
    "grafana/loki:latest",
    "grafana/tempo:latest",
    "mysql:8.0"
)

foreach ($image in $images) {
    $success = $false
    while (-not $success) {
        Write-Host "Pulling $image..."
        docker pull $image
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully pulled $image!" -ForegroundColor Green
            $success = $true
        } else {
            Write-Host "Failed to pull $image. Retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }
}

Write-Host "All images pulled successfully. Starting Docker Compose..." -ForegroundColor Green
docker compose up --build -d
