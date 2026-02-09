import { Card, CardHeader, CardBody } from "@/components/Card";
import { AlertCircle, CheckCircle } from "lucide-react";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

interface BudgetProgressProps {
  budgets: Budget[];
}

const getProgressColor = (spent: number, limit: number): string => {
  const percentage = (spent / limit) * 100;
  if (percentage >= 100) return "bg-destructive";
  if (percentage >= 80) return "bg-warning";
  return "bg-success";
};

const getStatusColor = (spent: number, limit: number): string => {
  if (spent > limit) return "text-destructive";
  if (spent / limit >= 0.8) return "text-warning";
  return "text-success";
};

export const BudgetProgress = ({ budgets }: BudgetProgressProps) => {
  if (!budgets || budgets.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-muted-foreground">No budgets created yet</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Budget Overview" />
      <CardBody className="space-y-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isExceeded = budget.spent > budget.limit;
          const remaining = Math.max(0, budget.limit - budget.spent);

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-foreground capitalize">
                    {budget.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {isExceeded ? (
                    <AlertCircle size={18} className="text-destructive" />
                  ) : (
                    <CheckCircle size={18} className="text-success" />
                  )}
                  <span
                    className={`text-sm font-medium ${getStatusColor(budget.spent, budget.limit)}`}
                  >
                    {isExceeded
                      ? `+$${(budget.spent - budget.limit).toFixed(2)}`
                      : `$${remaining.toFixed(2)} left`}
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(budget.spent, budget.limit)} transition-all duration-300`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {Math.min(percentage, 100).toFixed(0)}%
              </p>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
