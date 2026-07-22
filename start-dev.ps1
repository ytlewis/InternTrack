# InternTrack Development Server Startup Script

Write-Host "=== InternTrack Dev Server Startup ===" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
Write-Host "Checking MySQL status..." -ForegroundColor Yellow
$mysqlRunning = $false

try {
    $connection = New-Object System.Data.Odbc.OdbcConnection
    $connection.ConnectionString = "DRIVER={MySQL ODBC 8.0 Driver};SERVER=localhost;PORT=3306;UID=root;PWD=;"
    $connection.Open()
    $connection.Close()
    $mysqlRunning = $true
    Write-Host "✓ MySQL is already running" -ForegroundColor Green
} catch {
    Write-Host "✗ MySQL is not running" -ForegroundColor Red
}

# Start MySQL if not running
if (-not $mysqlRunning) {
    Write-Host "Starting MySQL..." -ForegroundColor Yellow
    
    # Try to start via XAMPP
    if (Test-Path "C:\xampp\mysql\bin\mysqld.exe") {
        Write-Host "Found XAMPP MySQL, starting..." -ForegroundColor Yellow
        Start-Process "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList "--console" -WindowStyle Hidden
        Write-Host "Waiting for MySQL to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Verify it started
        try {
            $connection = New-Object System.Data.Odbc.OdbcConnection
            $connection.ConnectionString = "DRIVER={MySQL ODBC 8.0 Driver};SERVER=localhost;PORT=3306;UID=root;PWD=;"
            $connection.Open()
            $connection.Close()
            Write-Host "✓ MySQL started successfully" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Could not verify MySQL connection. It may still be starting..." -ForegroundColor Yellow
            Write-Host "  Continuing anyway. If you see database errors, wait a moment and try again." -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ XAMPP MySQL not found at C:\xampp\mysql\bin\mysqld.exe" -ForegroundColor Red
        Write-Host "  Please install XAMPP or start MySQL manually" -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") {
            exit 1
        }
    }
}

Write-Host ""
Write-Host "Starting Vite development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  InternTrack is starting up!" -ForegroundColor Green
Write-Host "  MySQL:  Port 3306" -ForegroundColor White
Write-Host "  Server: http://localhost:3000" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the dev server
npm run dev
