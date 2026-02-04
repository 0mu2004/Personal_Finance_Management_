import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Button } from '@/components/Button';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/api/dashboard';
import {
  User,
  Mail,
  TrendingUp,
  Target,
  AlertCircle,
  Lightbulb,
  PiggyBank,
  Zap,
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardAPI.getSummary().then((res) => res.data),
  });

  const generateSavingsTips = () => {
    if (!summary) return [];

    const tips = [];
    const savingsRate =
      summary.total_income > 0
        ? (summary.savings / summary.total_income) * 100
        : 0;

    // Tip 1: Savings Rate
    if (savingsRate < 10) {
      tips.push({
        icon: <PiggyBank size={20} />,
        title: 'Increase Your Savings Rate',
        description:
          'Your current savings rate is low. Try to save at least 10-20% of your income each month. This is crucial for building wealth.',
        color: 'warning',
      });
    } else if (savingsRate >= 20) {
      tips.push({
        icon: <TrendingUp size={20} />,
        title: 'Great Savings Habit!',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up this excellent habit!`,
        color: 'success',
      });
    }

    // Tip 2: Expense Categories
    if (summary.category_breakdown) {
      const categories = Object.entries(summary.category_breakdown).sort(
        (a, b) => b[1] - a[1]
      );

      if (categories.length > 0) {
        const topCategory = categories[0];
        const topCategoryPercent =
          (topCategory[1] / summary.total_expenses) * 100;

        if (topCategoryPercent > 40) {
          tips.push({
            icon: <AlertCircle size={20} />,
            title: `High ${topCategory[0]} Spending`,
            description: `Your ${topCategory[0]} category accounts for ${topCategoryPercent.toFixed(1)}% of your expenses. Consider reducing this to boost savings.`,
            color: 'destructive',
          });
        }

        // Tip 3: Diversification
        if (categories.length < 3) {
          tips.push({
            icon: <Zap size={20} />,
            title: 'Diversify Your Spending',
            description:
              'You have very few spending categories. Track more categories to identify more savings opportunities.',
            color: 'primary',
          });
        }
      }
    }

    // Tip 4: Income vs Expense Ratio
    if (summary.total_income > 0) {
      const expenseRatio = (summary.total_expenses / summary.total_income) * 100;
      if (expenseRatio > 80) {
        tips.push({
          icon: <Lightbulb size={20} />,
          title: 'Budget Optimization Needed',
          description: `You're spending ${expenseRatio.toFixed(1)}% of your income. Try to keep expenses below 80% to increase savings.`,
          color: 'warning',
        });
      }
    }

    // Tip 5: General advice
    if (tips.length === 0) {
      tips.push({
        icon: <Target size={20} />,
        title: 'Start Tracking Your Finances',
        description:
          'Add more transactions to get personalized savings recommendations based on your spending patterns.',
        color: 'primary',
      });
    }

    return tips;
  };

  const tips = generateSavingsTips();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="mb-8 bg-gradient-to-r from-primary to-secondary">
            <CardBody className="text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
                    <User size={40} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">{user?.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-white/90">
                      <Mail size={16} />
                      <p>{user?.email}</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="bg-white text-primary hover:bg-white/90 border-0"
                >
                  Logout
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Stats Section */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Income Card */}
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Income
                    </h3>
                    <div className="p-2 bg-success/10 rounded-lg text-success">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-success">
                    ${summary.total_income.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Money earned
                  </p>
                </CardBody>
              </Card>

              {/* Expenses Card */}
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Expenses
                    </h3>
                    <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                      <AlertCircle size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-destructive">
                    ${summary.total_expenses.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Money spent
                  </p>
                </CardBody>
              </Card>

              {/* Savings Card */}
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Savings
                    </h3>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <PiggyBank size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    ${summary.savings.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Surplus amount
                  </p>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Financial Health Summary */}
          {summary && (
            <div className="mb-8">
              <Card>
                <CardHeader
                  title="Financial Health Summary"
                  subtitle="Quick overview of your financial metrics"
                />
                <CardBody>
                  <div className="space-y-4">
                    {/* Savings Rate */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Savings Rate
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {summary.total_income > 0
                            ? (
                                (summary.savings / summary.total_income) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              ((summary.savings / summary.total_income) * 100 ||
                                0),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentage of income saved
                      </p>
                    </div>

                    {/* Expense Ratio */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Expense Ratio
                        </span>
                        <span className="text-sm font-bold text-destructive">
                          {summary.total_income > 0
                            ? (
                                (summary.total_expenses / summary.total_income) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-full bg-destructive rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              ((summary.total_expenses / summary.total_income) *
                                100 ||
                                0),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentage of income spent
                      </p>
                    </div>

                    {/* Top Spending Category */}
                    {summary.category_breakdown &&
                      Object.entries(summary.category_breakdown).length > 0 && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Top Spending Category
                          </p>
                          <div className="space-y-2">
                            {Object.entries(summary.category_breakdown)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 3)
                              .map(([category, amount]) => (
                                <div
                                  key={category}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-sm text-muted-foreground capitalize">
                                    {category}
                                  </span>
                                  <span className="text-sm font-semibold text-foreground">
                                    ${amount.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Savings Tips */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              💡 Personalized Savings Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    tip.color === 'success'
                      ? 'border-l-success'
                      : tip.color === 'warning'
                        ? 'border-l-warning'
                        : tip.color === 'destructive'
                          ? 'border-l-destructive'
                          : 'border-l-primary'
                  }`}
                >
                  <CardBody>
                    <div className="flex gap-4">
                      <div
                        className={`flex-shrink-0 p-3 rounded-lg ${
                          tip.color === 'success'
                            ? 'bg-success/10 text-success'
                            : tip.color === 'warning'
                              ? 'bg-warning/10 text-warning'
                              : tip.color === 'destructive'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {tip.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* General Savings Advice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader
              title="General Savings Strategies"
              subtitle="Proven methods to improve your finances"
            />
            <CardBody>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✓</span>
                  <span className="text-sm text-foreground">
                    <strong>50/30/20 Rule:</strong> Allocate 50% of income to
                    needs, 30% to wants, and 20% to savings and debt repayment.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✓</span>
                  <span className="text-sm text-foreground">
                    <strong>Track Every Expense:</strong> Small expenses add up.
                    Recording all transactions helps identify waste.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✓</span>
                  <span className="text-sm text-foreground">
                    <strong>Automate Savings:</strong> Set up automatic transfers
                    to savings as soon as you get paid.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✓</span>
                  <span className="text-sm text-foreground">
                    <strong>Cut Unnecessary Subscriptions:</strong> Review
                    subscriptions monthly and cancel what you don't use.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✓</span>
                  <span className="text-sm text-foreground">
                    <strong>Build an Emergency Fund:</strong> Aim for 3-6 months
                    of expenses saved before investing.
                  </span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
