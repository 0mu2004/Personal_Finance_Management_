# FinTrack - Personal Finance Tracker

A modern, production-ready personal finance tracker web application built with React and TypeScript. **No backend required - everything runs in your browser with localStorage!**

## Features

### Authentication

- User registration and login
- Secure password storage in localStorage
- Session persistence

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

## Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS 3** - Styling
- **React Router 6** - Routing
- **TanStack Query** - Data fetching & caching
- **Recharts** - Charts & visualizations
- **Lucide React** - Icons

### Storage

- **Browser LocalStorage** - Data persistence (no backend needed!)

## Project Structure

```
fintrack/
├── client/
│   ├── components/              # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── FormInput.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── StatCard.tsx
│   │   └── ChartCard.tsx
│   ├── api/                     # Mock API (no backend required!)
│   │   ├── axiosClient.ts       # Mock client with localStorage
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
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and pnpm
- 5 minutes

That's it! No backend, no database, no complex setup required.

### Installation

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development server:**

   ```bash
   pnpm dev
   ```

   Frontend runs on `http://localhost:5173`

3. **Open in browser:**
   - Click the link shown in terminal
   - Or manually visit `http://localhost:5173`

## Usage

### Creating Your First Account

1. Click "Register" on the homepage
2. Enter your name, email, and password
3. Click "Register"
4. You'll be logged in automatically

### Adding Your First Transaction

1. Click "Transactions" in the navigation
2. Click "Add Transaction"
3. Fill in the details:
   - Type: Expense or Income
   - Amount: e.g., 50.00
   - Category: Select one
   - Description: Optional
   - Date: When it happened
4. Click "Add Transaction"

### Creating a Budget

1. Go to "Budget" page
2. Click "Add Budget"
3. Select a category
4. Set a monthly limit
5. Click "Create Budget"
6. Add expenses in that category to track against your budget

### Setting a Savings Goal

1. Go to "Goals" page
2. Click "Add Goal"
3. Name your goal (e.g., "Emergency Fund")
4. Set target amount
5. Set a deadline
6. Click "Add Goal"

### Viewing Your Dashboard

1. Click "Dashboard"
2. See your financial overview with charts
3. Track income, expenses, and savings

## Data Storage

**All data is stored in your browser's LocalStorage.** This means:

✅ **Pros:**

- No backend server needed
- No internet required (after initial load)
- Data stays on your computer
- Fast and responsive
- Free hosting

⚠️ **Important:**

- Data is specific to each browser/device
- Clearing browser data will delete everything
- Not synced across devices
- Keep backups if data is important

### Backing Up Your Data

Your data is stored as JSON in localStorage. You can export it:

```javascript
// In browser console (F12):
localStorage.getItem("transactions");
localStorage.getItem("budgets");
localStorage.getItem("goals");
localStorage.getItem("users");
```

## Build for Production

### Build

```bash
pnpm build
```

This creates a `dist` folder with your optimized app.

### Deploy

You can deploy the `dist` folder to any static hosting:

**Netlify**

```bash
pnpm build
# Drag and drop the 'dist' folder to Netlify
```

**Vercel**

```bash
pnpm build
# Connect your repository to Vercel
```

**GitHub Pages**

```bash
pnpm build
# Push dist folder to gh-pages branch
```

**Any Web Server**

```bash
pnpm build
# Upload dist folder to your server
```

## Development Commands

```bash
# Start dev server (auto-reload)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Type check
pnpm typecheck

# Format code
pnpm format.fix
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (iOS Safari, Chrome Mobile)

## Security & Privacy

Since everything runs in your browser:

- Your data never leaves your computer
- No server can access your financial information
- Passwords are stored locally (not sent anywhere)
- Your data is only as secure as your browser
- Clear your browser history to delete all data

**Note:** For sensitive financial data in production, consider using a backend with encryption.

## Limitations

- Data not synced across devices/browsers
- No collaborative features
- Browser storage limitations (~5-10MB typically)
- Data lost if browser cache is cleared

## Customization

### Change Theme Colors

Edit `client/global.css`:

```css
:root {
  --primary: 210 100% 50%; /* Change primary color */
  --secondary: 160 100% 42%; /* Change secondary color */
  --success: 160 100% 42%;
  --destructive: 0 84.2% 60.2%;
}
```

### Add Custom Categories

Edit transaction/budget pages and add to CATEGORIES array:

```typescript
const CATEGORIES = [
  { value: "your-category", label: "Your Category" },
  // ...
];
```

### Modify Components

All components are in `client/components/` - feel free to customize styling and layout.

## Performance

- Fast page loads (< 1 second)
- No network latency
- Responsive charts and interactions
- Optimized bundle size (~200KB gzipped)

## Known Issues & Solutions

### Data Not Persisting

- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode (data won't persist)
- Try a different browser

### Charts Not Showing

- Make sure you have transactions in that month/category
- Refresh the page (F5)
- Check browser console for errors (F12)

### Too Much Data

- localStorage typically allows 5-10MB
- If you hit the limit, the app will warn you
- Delete old transactions or export data

## Future Enhancements

- Export data to CSV/PDF
- Import data from files
- Dark mode toggle
- Recurring transactions
- Custom categories
- Data analytics
- Multiple currencies
- Mobile app (React Native)

## Contributing

Contributions welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make improvements
4. Submit a pull request

## License

MIT License - use freely for personal or commercial projects

## Support

For issues or questions:

1. Check browser console (F12) for error messages
2. Try clearing browser cache and cookies
3. Try a different browser
4. Check localStorage usage (DevTools > Application > LocalStorage)

---

**Enjoy FinTrack! Manage your finances with ease.** 💰

No backend. No servers. Just you and your data. Locally.

---

## Want to Extend with a Backend?

If you want to add:

- Cloud sync across devices
- Collaborative features
- Mobile apps
- Advanced analytics

The original repository includes FastAPI backend code. Contact for backend setup instructions.
