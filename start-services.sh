#!/bin/bash

# Uber-like Microservices - Complete Startup Script
# This script starts all backend services and frontend

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Starting Uber-like Microservices Architecture              ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATEWAY_DIR="$BASE_DIR/gateway"
USER_DIR="$BASE_DIR/User"
DRIVER_DIR="$BASE_DIR/Driver"
RIDE_DIR="$BASE_DIR/Ride"
FRONTEND_DIR="$BASE_DIR/frontend"

# Check prerequisites
echo -e "\n${BLUE}[1/5] Checking Prerequisites...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}ERROR: Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}ERROR: npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm installed: $(npm --version)${NC}"

# Check MongoDB connection
echo -e "\n${BLUE}[2/5] Checking Database & Message Queue...${NC}"
if ! nc -z localhost 27017 2>/dev/null; then
    echo -e "${YELLOW}⚠ MongoDB not running on localhost:27017${NC}"
    echo -e "${YELLOW}  Please start MongoDB before continuing${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is running${NC}"

if ! nc -z localhost 5672 2>/dev/null; then
    echo -e "${YELLOW}⚠ RabbitMQ not running on localhost:5672${NC}"
    echo -e "${YELLOW}  Please start RabbitMQ before continuing${NC}"
else
    echo -e "${GREEN}✓ RabbitMQ is running${NC}"
fi

if ! nc -z localhost 6379 2>/dev/null; then
    echo -e "${YELLOW}⚠ Redis not running on localhost:6379${NC}"
    echo -e "${YELLOW}  Please start Redis before continuing${NC}"
else
    echo -e "${GREEN}✓ Redis is running${NC}"
fi

# Install dependencies if needed
echo -e "\n${BLUE}[3/5] Installing Dependencies...${NC}"

services=("gateway" "User" "Driver" "Ride" "frontend")
for service in "${services[@]}"; do
    service_dir="${BASE_DIR}/$service"
    if [ -d "$service_dir" ]; then
        if [ ! -d "$service_dir/node_modules" ]; then
            echo -e "${YELLOW}Installing dependencies for $service...${NC}"
            cd "$service_dir"
            npm install --silent
        fi
    fi
done
echo -e "${GREEN}✓ Dependencies ready${NC}"

# Start Gateway
echo -e "\n${BLUE}[4/5] Starting Services...${NC}"

cd "$GATEWAY_DIR"
echo -e "${YELLOW}Starting API Gateway (port 3000)...${NC}"
npm run dev > "$BASE_DIR/logs/gateway.log" 2>&1 &
GATEWAY_PID=$!
echo -e "${GREEN}✓ Gateway started (PID: $GATEWAY_PID)${NC}"

# Start User Service
cd "$USER_DIR"
echo -e "${YELLOW}Starting User Service (port 3001)...${NC}"
npm run dev > "$BASE_DIR/logs/user-service.log" 2>&1 &
USER_PID=$!
echo -e "${GREEN}✓ User Service started (PID: $USER_PID)${NC}"

# Start Driver Service
cd "$DRIVER_DIR"
echo -e "${YELLOW}Starting Driver Service (port 3002)...${NC}"
npm run dev > "$BASE_DIR/logs/driver-service.log" 2>&1 &
DRIVER_PID=$!
echo -e "${GREEN}✓ Driver Service started (PID: $DRIVER_PID)${NC}"

# Start Ride Service
cd "$RIDE_DIR"
echo -e "${YELLOW}Starting Ride Service (port 3003)...${NC}"
npm run dev > "$BASE_DIR/logs/ride-service.log" 2>&1 &
RIDE_PID=$!
echo -e "${GREEN}✓ Ride Service started (PID: $RIDE_PID)${NC}"

# Start Frontend
echo -e "${YELLOW}Starting Frontend (port 5173)...${NC}"
cd "$FRONTEND_DIR"
npm run dev > "$BASE_DIR/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for services to be ready
echo -e "\n${BLUE}[5/5] Verifying Services...${NC}"
sleep 3

# Test each service
test_service() {
    local port=$1
    local name=$2
    local max_attempts=10
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $name is healthy${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done

    echo -e "${YELLOW}⚠ $name health check failed (it may still be starting)${NC}"
    return 1
}

test_service 3000 "API Gateway"
test_service 3001 "User Service"
test_service 3002 "Driver Service"
test_service 3003 "Ride Service"
test_service 5173 "Frontend"

# Store PIDs in file for later cleanup
echo -e "\n${BLUE}Saving process IDs...${NC}"
cat > "$BASE_DIR/.pids" << EOF
GATEWAY_PID=$GATEWAY_PID
USER_PID=$USER_PID
DRIVER_PID=$DRIVER_PID
RIDE_PID=$RIDE_PID
FRONTEND_PID=$FRONTEND_PID
EOF

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           All Services Started Successfully!                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}Service URLs:${NC}"
echo -e "  Gateway:        ${GREEN}http://localhost:3000${NC}"
echo -e "  User Service:   ${GREEN}http://localhost:3001${NC}"
echo -e "  Driver Service: ${GREEN}http://localhost:3002${NC}"
echo -e "  Ride Service:   ${GREEN}http://localhost:3003${NC}"
echo -e "  Frontend:       ${GREEN}http://localhost:5173${NC}"

echo -e "\n${BLUE}Test Commands:${NC}"
echo -e "  Gateway Health:    ${YELLOW}curl http://localhost:3000/health${NC}"
echo -e "  CORS Test:         ${YELLOW}curl -X OPTIONS http://localhost:3000/health -H 'Origin: http://localhost:5173' -v${NC}"
echo -e "  API Users:         ${YELLOW}curl http://localhost:3000/api/users${NC}"

echo -e "\n${BLUE}Log Files:${NC}"
echo -e "  Gateway:   $BASE_DIR/logs/gateway.log"
echo -e "  User:      $BASE_DIR/logs/user-service.log"
echo -e "  Driver:    $BASE_DIR/logs/driver-service.log"
echo -e "  Ride:      $BASE_DIR/logs/ride-service.log"
echo -e "  Frontend:  $BASE_DIR/logs/frontend.log"

echo -e "\n${BLUE}To stop all services:${NC}"
echo -e "  ${YELLOW}bash $BASE_DIR/stop-services.sh${NC}"

echo -e "\n${BLUE}To view logs in real-time:${NC}"
echo -e "  ${YELLOW}tail -f $BASE_DIR/logs/gateway.log${NC}"

# Keep script running and show logs
echo -e "\n${BLUE}Streaming logs (Ctrl+C to stop)...${NC}\n"
tail -f "$BASE_DIR/logs/gateway.log" "$BASE_DIR/logs/user-service.log" "$BASE_DIR/logs/driver-service.log" "$BASE_DIR/logs/ride-service.log" "$BASE_DIR/logs/frontend.log" 2>/dev/null &
TAIL_PID=$!

# Trap to clean up on exit
trap "kill $GATEWAY_PID $USER_PID $DRIVER_PID $RIDE_PID $FRONTEND_PID $TAIL_PID 2>/dev/null || true" EXIT

wait
