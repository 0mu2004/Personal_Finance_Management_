import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/api/dashboard";
import { transactionsAPI } from "@/api/transactions";
import { budgetsAPI } from "@/api/budgets";
import { goalsAPI } from "@/api/goals";
import { Navbar } from "@/components/Navbar";
import { SummaryCards } from "@/components/analytics/SummaryCards";
import { ExpenseTrendChart } from "@/components/analytics/ExpenseTrendChart";
import { CategoryPieChart } from "@/components/analytics/CategoryPieChart";
import { BudgetProgress } from "@/components/analytics/BudgetProgress";
import { GoalsProgress } from "@/components/analytics/GoalsProgress";
import { TransactionsBarChart } from "@/components/analytics/TransactionsBarChart";

// Helper to group transactions by date for bar chart
const getTransactionsByDate = (transactions: any[]) => {
  const grouped: { [key: string]: { income: number; expense: number } } = {};

  transactions.forEach((t) => {
    const date = t.date.split("T")[0]; // Get YYYY-MM-DD
    if (!grouped[date]) {
      grouped[date] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      grouped[date].income += t.amount;
    } else {
      grouped[date].expense += t.amount;
    }
  });

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30); // Last 30 days
};

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => dashboardAPI.getSummary().then((res) => res.data),
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsAPI.getTransactions().then((res) => res.data),
  });

  const { data: budgets = [], isLoading: budgetsLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetsAPI.getBudgets().then((res) => res.data),
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: () => goalsAPI.getGoals().then((res) => res.data),
  });

  const isLoading =
    summaryLoading || transactionsLoading || budgetsLoading || goalsLoading;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (!summary) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Unable to load dashboard</p>
        </div>
      </>
    );
  }

  // Prepare chart data
  const categoryData = summary.category_breakdown
    ? Object.entries(summary.category_breakdown).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
      }))
    : [];

  const monthlyData = summary.monthly_spending || [];
  const dailyTransactionData = getTransactionsByDate(transactions);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Your complete financial overview and analytics
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8">
            <SummaryCards data={summary} />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryPieChart data={categoryData} />
            <ExpenseTrendChart data={monthlyData} />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TransactionsBarChart data={dailyTransactionData} period="daily" />
            <BudgetProgress budgets={budgets} />
          </div>

          {/* Goals Row */}
          <div className="mb-6">
            <GoalsProgress goals={goals} />
          </div>
        </div>
      </div>
    </>
  );
}
