# FinTrack Analytics Dashboard Components

## Component Structure

```
client/
├── components/
│   └── analytics/
│       ├── index.ts                 (Barrel export)
│       ├── SummaryCards.tsx          (4 stat cards)
│       ├── ExpenseTrendChart.tsx     (Line chart)
│       ├── CategoryPieChart.tsx      (Donut chart)
│       ├── BudgetProgress.tsx        (Progress bars)
│       ├── GoalsProgress.tsx         (Goal tracking)
│       └── TransactionsBarChart.tsx  (Bar chart)
├── utils/
│   └── chartUtils.ts                 (Helper functions)
└── pages/
    └── Dashboard.tsx                 (Main dashboard page)
```

## Components

### 1. SummaryCards
- Total Income with trend
- Total Expenses with trend
- Savings amount with trend
- Savings Rate percentage
- Color-coded stat cards
- Real-time data binding

### 2. ExpenseTrendChart
- Monthly spending trend
- Line chart visualization
- Interactive tooltips
- Legend display
- 300px height responsive
- Dynamic data handling

### 3. CategoryPieChart
- Spending by category breakdown
- Percentage labels on pie slices
- Dynamic color assignment
- 350px height responsive
- Tooltip with dollar amounts
- Legend at bottom

### 4. BudgetProgress
- Multi-budget tracking
- Progress bars with color states
  - Red: Exceeded budget
  - Yellow: 80%+ of budget
  - Green: Safe range
- Remaining amount display
- Status icons (check/alert)
- Category-based organization

### 5. GoalsProgress
- Savings goal tracking
- Individual progress bars
- Days remaining countdown
- Completion status indicators
- Amount remaining calculation
- Deadline tracking

### 6. TransactionsBarChart
- Daily/Weekly income vs expenses
- Dual-bar comparison
- Income (green) vs Expenses (red)
- 300px height responsive
- Interactive tooltips
- Period selection support

## Features

- **Responsive Design**: Mobile, tablet, desktop optimized
- **Real-time Data**: Integrates with API endpoints
- **Color Coding**: Semantic colors (success, warning, destructive)
- **Interactive**: Hover effects, tooltips, legends
- **Accessible**: Semantic HTML, ARIA labels
- **Performance**: Optimized re-renders with React Query
- **Consistent**: Unified design language across all components

## API Integration

- GET /dashboard/summary → SummaryCards, ExpenseTrendChart, CategoryPieChart
- GET /transactions → TransactionsBarChart
- GET /budgets → BudgetProgress
- GET /goals → GoalsProgress

## Utilities

Chart utilities in `client/utils/chartUtils.ts`:
- Currency formatting
- Percentage formatting
- Color management
- Date formatting
- Trend calculation
- Data grouping by period
- Text truncation

## Usage

```tsx
import { SummaryCards, BudgetProgress, GoalsProgress } from "@/components/analytics";

<SummaryCards data={summary} />
<BudgetProgress budgets={budgets} />
<GoalsProgress goals={goals} />
```

## Styling

- TailwindCSS utility classes
- Custom color variables from theme
- Responsive grid layouts
- Card-based UI patterns
- Smooth transitions and animations
- Consistent spacing and typography
