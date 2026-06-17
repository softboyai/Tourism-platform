# PowerShell Script to Create Admin User
# Run this script: .\create-admin.ps1

Write-Host "🚀 Creating Admin User..." -ForegroundColor Green
Write-Host ""

# Get admin credentials (or use defaults)
$email = Read-Host "Enter admin email (default: admin@tourism-gabon.com)"
if ([string]::IsNullOrWhiteSpace($email)) {
    $email = "admin@tourism-gabon.com"
}

$password = Read-Host "Enter admin password (min 6 characters, default: admin123456)" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
if ([string]::IsNullOrWhiteSpace($passwordPlain)) {
    $passwordPlain = "admin123456"
}

# Load .env file to get ADMIN_SECRET
$envContent = Get-Content ".env" -Raw
$adminSecret = ""
if ($envContent -match "ADMIN_SECRET=(.+)") {
    $adminSecret = $matches[1].Trim()
}

if ([string]::IsNullOrWhiteSpace($adminSecret)) {
    Write-Host "⚠️  Warning: ADMIN_SECRET not found in .env file" -ForegroundColor Yellow
    Write-Host "Using default secret..." -ForegroundColor Yellow
    $adminSecret = "admin-registration-secret-key-change-in-production"
}

Write-Host ""
Write-Host "Creating admin with:" -ForegroundColor Cyan
Write-Host "  Email: $email" -ForegroundColor Cyan
Write-Host "  Password: [HIDDEN]" -ForegroundColor Cyan
Write-Host ""

# Create request body
$body = @{
    secret = $adminSecret
    email = $email
    password = $passwordPlain
} | ConvertTo-Json

try {
    # Make API request
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/seed" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ Admin created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login Credentials:" -ForegroundColor Cyan
    Write-Host "  Email: $email" -ForegroundColor White
    Write-Host "  Password: $passwordPlain" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 You can now login at: frontend/admin-login.html" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error creating admin:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error: $($errorDetails.message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. Server is running (npm run dev)" -ForegroundColor Yellow
    Write-Host "  2. MongoDB is connected" -ForegroundColor Yellow
    Write-Host "  3. ADMIN_SECRET in .env matches the secret you're using" -ForegroundColor Yellow
}

