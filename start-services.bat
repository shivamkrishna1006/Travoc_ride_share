@echo off
REM Uber-like Microservices - Windows Startup Script
REM This script starts all backend services and frontend

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     Starting Uber-like Microservices Architecture              ║
echo ║                    (Windows Version)                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Set directories
set "BASE_DIR=%~dp0"
set "GATEWAY_DIR=%BASE_DIR%gateway"
set "USER_DIR=%BASE_DIR%User"
set "DRIVER_DIR=%BASE_DIR%Driver"
set "RIDE_DIR=%BASE_DIR%Ride"
set "FRONTEND_DIR=%BASE_DIR%frontend"

REM Check if Node.js is installed
echo [1/4] Checking Prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    exit /b 1
)
echo ✓ Node.js installed:
node --version

REM Check MongoDB
echo [2/4] Checking Database Connections...
netstat -an | findstr ":27017" >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB not running on localhost:27017
    echo Please start MongoDB before continuing
    pause
    exit /b 1
)
echo ✓ MongoDB is running

REM Install dependencies if needed
echo [3/4] Installing Dependencies...
if not exist "%GATEWAY_DIR%\node_modules" (
    echo Installing gateway dependencies...
    cd /d "%GATEWAY_DIR%"
    call npm install --silent
)

if not exist "%USER_DIR%\node_modules" (
    echo Installing User Service dependencies...
    cd /d "%USER_DIR%"
    call npm install --silent
)

if not exist "%DRIVER_DIR%\node_modules" (
    echo Installing Driver Service dependencies...
    cd /d "%DRIVER_DIR%"
    call npm install --silent
)

if not exist "%RIDE_DIR%\node_modules" (
    echo Installing Ride Service dependencies...
    cd /d "%RIDE_DIR%"
    call npm install --silent
)

if not exist "%FRONTEND_DIR%\node_modules" (
    echo Installing Frontend dependencies...
    cd /d "%FRONTEND_DIR%"
    call npm install --silent
)

echo ✓ Dependencies ready

REM Create logs directory
if not exist "%BASE_DIR%logs" mkdir "%BASE_DIR%logs"

REM Start services
echo.
echo [4/4] Starting Services...
echo.

REM Start Gateway
cd /d "%GATEWAY_DIR%"
echo Starting API Gateway (port 3000)...
start "Gateway" cmd /k "npm run dev"
timeout /t 2 /nobreak

REM Start User Service
cd /d "%USER_DIR%"
echo Starting User Service (port 3001)...
start "User Service" cmd /k "npm run dev"
timeout /t 2 /nobreak

REM Start Driver Service
cd /d "%DRIVER_DIR%"
echo Starting Driver Service (port 3002)...
start "Driver Service" cmd /k "npm run dev"
timeout /t 2 /nobreak

REM Start Ride Service
cd /d "%RIDE_DIR%"
echo Starting Ride Service (port 3003)...
start "Ride Service" cmd /k "npm run dev"
timeout /t 2 /nobreak

REM Start Frontend
cd /d "%FRONTEND_DIR%"
echo Starting Frontend (port 5173)...
start "Frontend" cmd /k "npm run dev"
timeout /t 2 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           All Services Started Successfully!                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Service URLs:
echo   Gateway:        http://localhost:3000
echo   User Service:   http://localhost:3001
echo   Driver Service: http://localhost:3002
echo   Ride Service:   http://localhost:3003
echo   Frontend:       http://localhost:5173
echo.

echo Test Commands (in PowerShell or Command Prompt):
echo   Gateway Health:
echo   curl http://localhost:3000/health
echo.
echo   Test CORS (with proper headers):
echo   curl -X OPTIONS http://localhost:3000/health -H "Origin: http://localhost:5173" -v
echo.

echo Opening browser...
timeout /t 2 /nobreak
start http://localhost:5173

echo.
echo Services are running in separate windows above.
echo Close each window to stop the respective service.
echo.
pause
