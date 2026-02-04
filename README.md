# FinTrack - Personal Finance Tracker

A modern, production-ready personal finance tracker web application built with React, TypeScript, and FastAPI.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing

### Dashboard
- Real-time financial overview
- Total income, expenses, and savings visualization
- Category-wise spending breakdown (Pie Chart)
- Monthly spending trends (Bar Chart)
- Savings rate calculation

### Transactions
- Add, edit, and delete transactions
- Categorize as income or expense
- Filter by category and date
- Detailed transaction history

### Budget Management
- Create category-based budgets
- Track spending vs budget limits
- Visual progress bars
- Alerts when budget exceeded
- Remaining budget calculations

### Savings Goals
- Create and track savings goals
- Monitor progress toward targets
- Deadline tracking
- Goal completion status

### Responsive Design
- Mobile-first approach
- Works on all devices
- Beautiful fintech UI

## Project Structure

```
fintrack/
├── client/                      # React Frontend
│   ├── components/              # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── FormInput.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── StatCard.tsx
│   │   └── ChartCard.tsx
│   ├── api/                     # API integration layer
│   │   ├── axiosClient.ts
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   ├── budgets.ts
│   │   ├── goals.ts
│   │   └── dashboard.ts
│   ├── context/                 # React Context
│   │   └── AuthContext.tsx
│   ├── pages/                   # Route pages
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Budget.tsx
│   │   └── Goals.tsx
│   ├── App.tsx                  # App routing
│   ├── global.css               # Global styles
│   └── main.tsx                 # Entry point
│
├── backend/                     # FastAPI Backend
│   ├── main.py                  # FastAPI application
│   ├── database.py              # MongoDB connection
│   ├── auth.py                  # Authentication utilities
│   ├── schemas.py               # Pydantic models
│   ├── dependencies.py          # FastAPI dependencies
│   ├── routes/                  # API routes
│   │   ├── auth.py
│   │   ├── transactions.py
│   │   ├── budgets.py
│   │   ├── goals.py
│   │   └── dashboard.py
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment variables template
│   └── Dockerfile               # Docker configuration
│
├── docker-compose.yml           # Docker Compose setup
├── .env.local                   # Frontend environment variables
├── package.json                 # Node dependencies
└── README.md                    # This file
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS 3** - Styling
- **React Router 6** - Routing
- **Axios** - HTTP client
- **TanStack Query** - Data fetching & caching
- **Recharts** - Charts & visualizations
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **MongoDB** - Database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Python-Jose** - JWT authentication
- **Passlib** - Password hashing
- **Uvicorn** - ASGI server

## Setup & Installation

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+
- MongoDB (local or Docker)
- Git

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure MongoDB:**
   - Update `MONGO_URI` in `.env` if using local MongoDB
   - Default: `mongodb://localhost:27017`

4. **Run FastAPI server:**
   ```bash
   python main.py
   ```
   Server runs on `http://localhost:8000`
   API docs available at `http://localhost:8000/docs`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.local .env.local
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```
   Frontend runs on `http://localhost:5173`

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:
- MongoDB on `localhost:27017`
- FastAPI on `http://localhost:8000`

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=fintrack
SECRET_KEY=your-super-secret-key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary

## Development Commands

### Frontend
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

### Backend
```bash
# Start dev server with auto-reload
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment

### Frontend
```bash
pnpm build
# Deploy the `dist` folder to your hosting provider
```

### Backend
```bash
# Build Docker image
docker build -t fintrack-api ./backend

# Run container
docker run -d \
  -e MONGO_URI=your_mongo_uri \
  -e SECRET_KEY=your_secret_key \
  -e CORS_ORIGINS=your_frontend_url \
  -p 8000:8000 \
  fintrack-api
```

### Environment Variables for Production
- Set strong `SECRET_KEY`
- Update `MONGO_URI` to production MongoDB
- Configure proper `CORS_ORIGINS`
- Use HTTPS only

## Testing the Application

### Login Credentials (After Registration)
1. Go to `http://localhost:5173/register`
2. Create a new account
3. Navigate to Dashboard

### Sample Data Entry
1. Add transactions (income/expenses)
2. Create budgets for different categories
3. Set savings goals
4. View analytics on the dashboard

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 days
- API endpoints are protected with authentication
- CORS is properly configured
- Environment variables for sensitive data

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongosh` or check docker
- Verify `MONGO_URI` in `.env`
- Check network connectivity

### CORS Errors
- Verify `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL is included
- Check browser console for specific errors

### API Not Responding
- Confirm backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Review backend logs for errors

### JWT Token Issues
- Clear browser localStorage
- Log out and log back in
- Check token expiration (30 days)

## Performance Optimization

- React Query caching reduces API calls
- Lazy loading for pages via React Router
- Optimized re-renders with proper dependencies
- MongoDB indexing for faster queries
- Async/await for non-blocking operations

## Future Enhancements

- Email notifications for budget alerts
- Recurring transactions
- Export reports (PDF/CSV)
- Multi-currency support
- Budget forecasting
- Expense categorization suggestions
- Dark mode
- Mobile app (React Native)

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Author

Built with ❤️ as a complete full-stack finance tracking solution.

---

**Happy budgeting! 💰**
