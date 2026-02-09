import { Card, CardHeader, CardBody } from "@/components/Card";
import { Target, CheckCircle, Clock } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

interface GoalsProgressProps {
  goals: Goal[];
}

const daysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const timeDiff = deadlineDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const GoalsProgress = ({ goals }: GoalsProgressProps) => {
  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-muted-foreground">No savings goals created yet</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Savings Goals" />
      <CardBody className="space-y-6">
        {goals.map((goal) => {
          const percentage = (goal.current_amount / goal.target_amount) * 100;
          const isCompleted = goal.current_amount >= goal.target_amount;
          const days = daysUntilDeadline(goal.deadline);
          const isOverdue = days < 0;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{goal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${goal.current_amount.toFixed(2)} / $
                      {goal.target_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  {isCompleted && (
                    <CheckCircle size={18} className="text-success" />
                  )}
                  <div>
                    {isCompleted ? (
                      <span className="text-sm font-medium text-success">
                        Completed
                      </span>
                    ) : isOverdue ? (
                      <span className="text-sm font-medium text-destructive">
                        Overdue
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-primary flex items-center gap-1">
                        <Clock size={14} />
                        {days}d
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCompleted ? "bg-success" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.min(percentage, 100).toFixed(0)}%</span>
                <span>
                  ${Math.max(0, goal.target_amount - goal.current_amount).toFixed(2)} remaining
                </span>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
