import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/ChartCard";

interface MonthlyData {
  month: string;
  amount: number;
}

interface ExpenseTrendChartProps {
  data: MonthlyData[];
}

export const ExpenseTrendChart = ({ data }: ExpenseTrendChartProps) => {
  return (
    <ChartCard title="Monthly Expense Trend">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
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
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#0084FF"
              strokeWidth={2}
              dot={{ fill: "#0084FF", r: 4 }}
              activeDot={{ r: 6 }}
              name="Monthly Spending"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No expense data available
        </div>
      )}
    </ChartCard>
  );
};
