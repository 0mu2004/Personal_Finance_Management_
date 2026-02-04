# FinTrack - Quick Start Guide

Get FinTrack up and running in minutes!

## Option 1: Using Docker Compose (Recommended) ⭐

**Fastest way to get started - everything in one command!**

### Requirements
- Docker & Docker Compose installed
- 10 minutes
- ~1GB disk space

### Steps

1. **Clone/Download the project**
   ```bash
   cd fintrack
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to start** (usually 15-20 seconds)
   ```bash
   docker-compose logs -f
   ```
   Wait until you see "Application startup complete"

4. **Access the application**
   - **Frontend**: Open http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs

5. **Create an account and start using**
   - Click "Register" on the homepage
   - Fill in your details
   - Start adding transactions!

6. **Stop services**
   ```bash
   docker-compose down
   ```

---

## Option 2: Local Development Setup

### Requirements
- Node.js 18+ and pnpm
- Python 3.11+
- MongoDB installed locally
- 20 minutes

### Backend Setup

1. **Start MongoDB**
   - **On macOS (with Homebrew):**
     ```bash
     brew services start mongodb-community
     ```
   - **On Windows:**
     - Download from https://www.mongodb.com/try/download/community
     - Run the installer
     - MongoDB will start automatically
   - **On Linux:**
     ```bash
     sudo systemctl start mongod
     ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Default settings should work for local development

4. **Start FastAPI server**
   ```bash
   python main.py
   ```
   You should see:
   ```
   Uvicorn running on http://0.0.0.0:8000
   Connected to MongoDB
   ```

### Frontend Setup (in a new terminal)

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```
   Frontend should open at http://localhost:5173

3. **In your browser**
   - The app should be running!
   - Click "Register" to create your first account

---

## First Steps After Setup

### 1. Create Your First Transaction
   - Click "Transactions" in the sidebar
   - Click "Add Transaction"
   - Select "Expense"
   - Enter amount: `50.00`
   - Category: "Food & Dining"
   - Click "Add Transaction"

### 2. Create a Budget
   - Click "Budget" in the sidebar
   - Click "Add Budget"
   - Category: "Food & Dining"
   - Limit: `300` (for the month)
   - Click "Create Budget"

### 3. Set a Savings Goal
   - Click "Goals" in the sidebar
   - Click "Add Goal"
   - Name: "Emergency Fund"
   - Target: `10000`
   - Current: `0`
   - Deadline: Pick a date 6 months away
   - Click "Add Goal"

### 4. View Your Dashboard
   - Click "Dashboard" to see all your data
   - Charts will populate as you add more transactions

---

## Troubleshooting

### Docker Issues

**Problem: Port already in use**
```bash
# Change port in docker-compose.yml
# Or kill the process using the port
# macOS/Linux:
lsof -i :5173
kill -9 <PID>
```

**Problem: Docker containers won't start**
```bash
# Check logs
docker-compose logs

# Restart everything
docker-compose down
docker-compose up -d --build
```

### Backend Issues

**Problem: MongoDB connection refused**
- Make sure MongoDB is running: `mongosh` should connect
- Check MONGO_URI in `.env`

**Problem: Port 8000 already in use**
```bash
# Find and kill process on port 8000
# macOS/Linux:
lsof -i :8000
kill -9 <PID>

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Problem: ModuleNotFoundError**
```bash
# Reinstall dependencies
cd backend
pip install --upgrade -r requirements.txt
```

### Frontend Issues

**Problem: Can't connect to backend API**
- Check `.env.local` has `VITE_API_URL=http://localhost:8000/api`
- Make sure backend is running: http://localhost:8000/health
- Check browser console for specific errors

**Problem: Port 5173 already in use**
```bash
# Find and kill process
# macOS/Linux:
lsof -i :5173
kill -9 <PID>

# Or just run on different port
pnpm dev -- --port 3000
```

---

## Running Tests

### Frontend
```bash
pnpm test
```

### Backend
```bash
# Install pytest
pip install pytest pytest-asyncio

# Run tests
pytest
```

---

## Next Steps

1. **Read the full documentation**: See [README.md](README.md)
2. **Customize the theme**: Edit `client/global.css`
3. **Add more features**: Check the README for ideas
4. **Deploy to production**: See deployment guide in README

---

## Useful Commands

### View Logs
```bash
# Docker logs
docker-compose logs -f

# Backend logs (if running locally)
# They show in the terminal where you ran python main.py

# Frontend logs
# Check browser console (F12)
```

### Reset Database
```bash
# Using MongoDB CLI
mongosh
use fintrack
db.dropDatabase()

# Or delete Docker volume
docker volume rm fintrack_mongodb_data
docker-compose up -d
```

### View API Documentation
Open http://localhost:8000/docs in your browser after starting the backend.

---

## Performance Tips

1. **Use Docker**: Faster setup and isolated environment
2. **Clear browser cache**: Ctrl+Shift+Delete or Cmd+Shift+Delete
3. **Check network tab**: In browser DevTools to see API calls
4. **Read backend logs**: Important error information

---

## Need Help?

1. **Check logs** - Most issues are shown in logs
2. **Verify ports** - Make sure 5173 and 8000 are free
3. **Check MongoDB** - Make sure it's running
4. **Clear cache** - Browser and pip cache
5. **Reinstall dependencies** - Sometimes helps

---

## Security Notes

For **production deployment**:
- Change `SECRET_KEY` in `.env`
- Use environment variables for secrets
- Enable HTTPS
- Set proper CORS_ORIGINS
- Use MongoDB with authentication
- Update API endpoints to production URL

---

Enjoy using FinTrack! 🎉💰

For detailed documentation, see [README.md](README.md)
