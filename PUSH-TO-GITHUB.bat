@echo off
title Push to GitHub
cd /d "%~dp0"

echo.
echo Pushing to GitHub: https://github.com/softboyai/Tourism-platform
echo.

set HTTP_PROXY=
set HTTPS_PROXY=
git branch -M main
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo SUCCESS! Your code is now on GitHub.
    echo https://github.com/softboyai/Tourism-platform
) else (
    echo.
    echo Push failed. Make sure you are signed in to GitHub.
    echo Use a Personal Access Token instead of password.
)

echo.
pause
