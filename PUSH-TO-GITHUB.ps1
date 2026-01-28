# Push Tourism Platform to GitHub
# Double-click this file or run: .\PUSH-TO-GITHUB.ps1

Write-Host ""
Write-Host "Pushing to GitHub: https://github.com/softboyai/Tourism-platform" -ForegroundColor Cyan
Write-Host ""

# Clear proxy (in case it causes 127.0.0.1 error)
$env:HTTP_PROXY = ''
$env:HTTPS_PROXY = ''
$env:http_proxy = ''
$env:https_proxy = ''

# Ensure we're on main and push
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Your code is now on GitHub." -ForegroundColor Green
    Write-Host "https://github.com/softboyai/Tourism-platform" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Push failed. Common fixes:" -ForegroundColor Yellow
    Write-Host "  1. Sign in to GitHub (use Personal Access Token, not password)" -ForegroundColor White
    Write-Host "  2. Run in PowerShell: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned" -ForegroundColor White
    Write-Host "  3. Check internet connection" -ForegroundColor White
    Write-Host ""
}

Read-Host "Press Enter to close"
