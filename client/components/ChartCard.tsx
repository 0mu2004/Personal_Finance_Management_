import React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = "",
}) => (
  <div
    className={`bg-card border border-border rounded-lg p-6 shadow-sm ${className}`}
  >
    <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
    <div className="w-full overflow-x-auto">{children}</div>
  </div>
);
