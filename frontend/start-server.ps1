# PowerShell Script to Start Frontend Server
# Run: .\start-server.ps1

Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Green
Write-Host ""

# Check if Python is installed
$python = Get-Command python -ErrorAction SilentlyContinue
$python3 = Get-Command python3 -ErrorAction SilentlyContinue

if ($python) {
    Write-Host "✅ Python found! Starting server on port 8000..." -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Open in browser: http://localhost:8000/admin-login.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    python -m http.server 8000
} elseif ($python3) {
    Write-Host "✅ Python3 found! Starting server on port 8000..." -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Open in browser: http://localhost:8000/admin-login.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    python3 -m http.server 8000
} else {
    Write-Host "❌ Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python or use one of these alternatives:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Install Python from https://www.python.org/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 2: Use Node.js http-server:" -ForegroundColor Cyan
    Write-Host "  npm install -g http-server" -ForegroundColor White
    Write-Host "  http-server -p 8000" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Use VS Code Live Server extension" -ForegroundColor Cyan
}

