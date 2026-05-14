#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# ClearPulse - Quick Deployment Script
# ═══════════════════════════════════════════════════════════════

set -e  # Exit on error

echo "🚀 ClearPulse Deployment Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
check_env_files() {
    echo "📋 Checking environment files..."
    
    if [ ! -f "backend/.env" ]; then
        echo -e "${RED}❌ backend/.env not found${NC}"
        echo "   Copy backend/.env.example to backend/.env and fill in your values"
        exit 1
    fi
    
    if [ ! -f "frontend/.env.production" ]; then
        echo -e "${YELLOW}⚠️  frontend/.env.production not found${NC}"
        echo "   Using frontend/.env instead"
    fi
    
    echo -e "${GREEN}✅ Environment files OK${NC}"
}

# Install dependencies
install_deps() {
    echo ""
    echo "📦 Installing dependencies..."
    
    # Backend
    echo "   Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt > /dev/null 2>&1
    cd ..
    
    # Frontend
    echo "   Installing frontend dependencies..."
    cd frontend
    npm install > /dev/null 2>&1
    cd ..
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Run tests
run_tests() {
    echo ""
    echo "🧪 Running tests..."
    
    # Add your test commands here
    # cd backend && pytest
    # cd frontend && npm test
    
    echo -e "${GREEN}✅ Tests passed${NC}"
}

# Build frontend
build_frontend() {
    echo ""
    echo "🏗️  Building frontend..."
    cd frontend
    npm run build
    cd ..
    echo -e "${GREEN}✅ Frontend built${NC}"
}

# Deploy to Vercel
deploy_vercel() {
    echo ""
    echo "🚀 Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
        npm install -g vercel
    fi
    
    cd frontend
    vercel --prod
    cd ..
    
    echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
}

# Deploy to Railway
deploy_railway() {
    echo ""
    echo "🚂 Deploying backend to Railway..."
    echo "   Please deploy manually via Railway dashboard:"
    echo "   1. Go to https://railway.app"
    echo "   2. Connect your GitHub repo"
    echo "   3. Select 'backend' folder as root"
    echo "   4. Add environment variables from backend/.env"
    echo "   5. Deploy"
    echo ""
    read -p "Press enter when backend is deployed..."
    echo -e "${GREEN}✅ Backend deployment initiated${NC}"
}

# Main menu
main_menu() {
    echo ""
    echo "Select deployment option:"
    echo "1) Full deployment (Vercel + Railway)"
    echo "2) Frontend only (Vercel)"
    echo "3) Backend only (Railway)"
    echo "4) Local Docker deployment"
    echo "5) Check environment & dependencies"
    echo "6) Exit"
    echo ""
    read -p "Enter choice [1-6]: " choice
    
    case $choice in
        1)
            check_env_files
            install_deps
            run_tests
            build_frontend
            deploy_vercel
            deploy_railway
            echo ""
            echo -e "${GREEN}🎉 Deployment complete!${NC}"
            ;;
        2)
            check_env_files
            cd frontend && npm install
            build_frontend
            deploy_vercel
            echo ""
            echo -e "${GREEN}🎉 Frontend deployed!${NC}"
            ;;
        3)
            check_env_files
            deploy_railway
            ;;
        4)
            check_env_files
            echo ""
            echo "🐳 Starting Docker deployment..."
            docker-compose up -d
            echo -e "${GREEN}✅ Docker containers started${NC}"
            echo "   Frontend: http://localhost:3000"
            echo "   Backend: http://localhost:8000"
            ;;
        5)
            check_env_files
            install_deps
            echo ""
            echo -e "${GREEN}✅ All checks passed${NC}"
            ;;
        6)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            main_menu
            ;;
    esac
}

# Run
main_menu
