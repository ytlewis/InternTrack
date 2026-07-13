# Database Setup Script for InternTrack
# This script helps set up MySQL database using Docker

Write-Host "=== InternTrack Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is available
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker not found. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Desktop is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Waiting for Docker to start (this may take 30-60 seconds)..." -ForegroundColor Yellow
    
    $timeout = 60
    $elapsed = 0
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 5
        $elapsed += 5
        try {
            docker ps | Out-Null
            Write-Host "✓ Docker is now running" -ForegroundColor Green
            break
        } catch {
            Write-Host "Still waiting... ($elapsed seconds)" -ForegroundColor Yellow
        }
    }
    
    if ($elapsed -ge $timeout) {
        Write-Host "✗ Docker failed to start within $timeout seconds" -ForegroundColor Red
        Write-Host "Please start Docker Desktop manually and run this script again" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "Starting MySQL container..." -ForegroundColor Yellow

# Stop and remove existing container if it exists
docker stop interntrack-mysql 2>$null
docker rm interntrack-mysql 2>$null

# Start MySQL container using docker-compose
try {
    docker-compose up -d
    Write-Host "✓ MySQL container started successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to start MySQL container" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Waiting for MySQL to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Update .env file
Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

$envPath = ".env"
$envContent = Get-Content $envPath -Raw

# Check if DATABASE_URL is already set
if ($envContent -match "DATABASE_URL=mysql://") {
    Write-Host "! DATABASE_URL already configured" -ForegroundColor Yellow
} else {
    $newDatabaseUrl = "DATABASE_URL=mysql://interntrack:interntrack123@localhost:3306/interntrack"
    $envContent = $envContent -replace "DATABASE_URL=", $newDatabaseUrl
    Set-Content -Path $envPath -Value $envContent
    Write-Host "✓ .env file updated with DATABASE_URL" -ForegroundColor Green
}

# Push database schema
Write-Host ""
Write-Host "Pushing database schema..." -ForegroundColor Yellow
try {
    npm run db:push
    Write-Host "✓ Database schema created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to push database schema" -ForegroundColor Red
    Write-Host "You may need to run 'npm run db:push' manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your development server (Ctrl+C and then 'npm run dev')" -ForegroundColor White
Write-Host "2. Visit http://localhost:5173" -ForegroundColor White
Write-Host "3. Click 'Get Started' to create your first account" -ForegroundColor White
Write-Host ""
Write-Host "To stop MySQL: docker-compose down" -ForegroundColor Yellow
Write-Host "To view MySQL logs: docker-compose logs -f" -ForegroundColor Yellow
Write-Host ""
