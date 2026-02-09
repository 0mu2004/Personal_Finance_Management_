import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/ChartCard";

interface TransactionData {
  date: string;
  income: number;
  expense: number;
}

interface TransactionsBarChartProps {
  data: TransactionData[];
  period?: "daily" | "weekly";
}

export const TransactionsBarChart = ({
  data,
  period = "daily",
}: TransactionsBarChartProps) => {
  const title =
    period === "weekly"
      ? "Weekly Income vs Expenses"
      : "Daily Income vs Expenses";

  return (
    <ChartCard title={title}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip
              formatter={(value) => `$${(value as number).toFixed(2)}`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="income"
              fill="#00C99A"
              name="Income"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="#FF6B6B"
              name="Expenses"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No transaction data available
        </div>
      )}
    </ChartCard>
  );
};
