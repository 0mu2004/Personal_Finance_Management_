import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/api/dashboard';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { ChartCard } from '@/components/ChartCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

const COLORS = ['#0084FF', '#00C99A', '#FFB81C', '#FF6B6B', '#6C5CE7', '#FD79A8'];

export default function Dashboard() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardAPI.getSummary().then((res) => res.data),
  });

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
        name: key,
        value: value,
      }))
    : [];

  const monthlyData = summary.monthly_spending || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Get a snapshot of your financial health
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Income"
              value={`$${summary.total_income.toFixed(2)}`}
              icon={<TrendingUp size={24} />}
              color="success"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Expenses"
              value={`$${summary.total_expenses.toFixed(2)}`}
              icon={<TrendingDown size={24} />}
              color="destructive"
              trend={{ value: 5, isPositive: false }}
            />
            <StatCard
              title="Savings"
              value={`$${summary.savings.toFixed(2)}`}
              icon={<Target size={24} />}
              color="primary"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Savings Rate"
              value={`${summary.total_income > 0 ? ((summary.savings / summary.total_income) * 100).toFixed(1) : 0}%`}
              icon={<DollarSign size={24} />}
              color="warning"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <ChartCard title="Spending by Category">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No spending data available
                </div>
              )}
            </ChartCard>

            {/* Bar Chart */}
            <ChartCard title="Monthly Spending Trend">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="amount" fill="#0084FF" name="Spending" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No monthly data available
                </div>
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </>
  );
}
