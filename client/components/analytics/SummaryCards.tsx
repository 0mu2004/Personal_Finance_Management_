import { StatCard } from "@/components/StatCard";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

interface SummaryData {
  total_income: number;
  total_expenses: number;
  savings: number;
}

interface SummaryCardsProps {
  data: SummaryData;
}

export const SummaryCards = ({ data }: SummaryCardsProps) => {
  const savingsRate =
    data.total_income > 0
      ? ((data.savings / data.total_income) * 100).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Income"
        value={`$${data.total_income.toFixed(2)}`}
        icon={<TrendingUp size={24} />}
        color="success"
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Total Expenses"
        value={`$${data.total_expenses.toFixed(2)}`}
        icon={<TrendingDown size={24} />}
        color="destructive"
        trend={{ value: 5, isPositive: false }}
      />
      <StatCard
        title="Savings"
        value={`$${data.savings.toFixed(2)}`}
        icon={<Target size={24} />}
        color="primary"
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Savings Rate"
        value={`${savingsRate}%`}
        icon={<DollarSign size={24} />}
        color="warning"
      />
    </div>
  );
};
