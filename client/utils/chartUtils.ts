export const CHART_COLORS = [
  "#0084FF", // Primary Blue
  "#00C99A", // Success Green
  "#FFB81C", // Warning Yellow
  "#FF6B6B", // Destructive Red
  "#6C5CE7", // Purple
  "#FD79A8", // Pink
  "#A29BFE", // Light Purple
  "#74B9FF", // Light Blue
  "#55EFC4", // Light Green
  "#FDCB6E", // Light Orange
];

export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getChartColor = (index: number, colors = CHART_COLORS): string => {
  return colors[index % colors.length];
};

export const formatChartDate = (
  date: string,
  format: "short" | "long" = "short",
): string => {
  const d = new Date(date);
  if (format === "short") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateTrend = (
  current: number,
  previous: number,
): { value: number; isPositive: boolean } => {
  if (previous === 0) {
    return { value: 0, isPositive: current >= 0 };
  }
  const percentage = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(percentage),
    isPositive: percentage >= 0,
  };
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const groupDataByPeriod = (
  data: any[],
  period: "daily" | "weekly" | "monthly",
): any[] => {
  const grouped: { [key: string]: any } = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (period) {
      case "daily":
        key = item.date.split("T")[0];
        break;
      case "weekly":
        const week = Math.floor(date.getDate() / 7);
        key = `${date.getFullYear()}-W${week}`;
        break;
      case "monthly":
        key = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
        break;
    }

    if (!grouped[key]) {
      grouped[key] = { ...item, count: 0 };
    }
    grouped[key].count += 1;
  });

  return Object.values(grouped);
};
