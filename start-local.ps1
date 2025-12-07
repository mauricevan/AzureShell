# PowerShell script to start both backend and frontend locally
# Usage: .\start-local.ps1

Write-Host "🚀 Starting Azure Portal Shell locally..." -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠️  Warning: frontend\.env.local not found!" -ForegroundColor Yellow
    Write-Host "   Please copy frontend\.env.local.example to frontend\.env.local" -ForegroundColor Yellow
    Write-Host "   and update it with your Azure AD credentials." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Start backend
Write-Host "📦 Starting backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; dotnet run" -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "🌐 Starting frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Both services are starting!" -ForegroundColor Green
Write-Host "   Backend: http://localhost:5000" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

