import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/ChartCard";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

const COLORS = [
  "#0084FF",
  "#00C99A",
  "#FFB81C",
  "#FF6B6B",
  "#6C5CE7",
  "#FD79A8",
  "#A29BFE",
  "#74B9FF",
];

export const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard title="Spending by Category">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => {
                const percentage = ((value / total) * 100).toFixed(1);
                return `${name}: ${percentage}%`;
              }}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${(value as number).toFixed(2)}`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          No category data available
        </div>
      )}
    </ChartCard>
  );
};
