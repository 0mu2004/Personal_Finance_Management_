import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { goalsAPI, Goal } from "@/api/goals";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardBody } from "@/components/Card";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { Plus, Trash2, Edit2, DollarSign } from "lucide-react";

export default function Goals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    starting_amount: "",
    deadline: "",
  });
  const [fundsAmount, setFundsAmount] = useState("");

  const {
    data: goals = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: () => goalsAPI.getGoals().then((res) => res.data),
  });

  const handleOpenModal = (goal?: Goal) => {
    if (goal) {
      setEditingId(goal.id);
      setFormData({
        name: goal.name,
        target_amount: goal.target_amount.toString(),
        starting_amount: goal.current_amount.toString(),
        deadline: goal.deadline.split("T")[0],
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        target_amount: "",
        starting_amount: "",
        deadline: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenFundsModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setFundsAmount("");
    setIsFundsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await goalsAPI.updateGoal(editingId, {
          name: formData.name,
          target_amount: parseFloat(formData.target_amount),
          current_amount: parseFloat(formData.starting_amount),
          deadline: formData.deadline,
        });
      } else {
        await goalsAPI.createGoal({
          name: formData.name,
          target_amount: parseFloat(formData.target_amount),
          current_amount: parseFloat(formData.starting_amount),
          deadline: formData.deadline,
        });
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGoalId || !fundsAmount || parseFloat(fundsAmount) <= 0) {
      return;
    }

    try {
      await goalsAPI.addFunds(selectedGoalId, parseFloat(fundsAmount));
      setIsFundsModalOpen(false);
      setFundsAmount("");
      setSelectedGoalId(null);
      refetch();
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await goalsAPI.deleteGoal(id);
        refetch();
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const daysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Goals</h1>
              <p className="text-muted-foreground mt-2">
                Set and track your savings goals
              </p>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} />
              Add Goal
            </Button>
          </div>

          {/* Goals Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No goals created yet
                </p>
                <Button onClick={() => handleOpenModal()}>
                  Create your first goal
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const percentage =
                  (goal.current_amount / goal.target_amount) * 100;
                const days = daysUntilDeadline(goal.deadline);
                const isCompleted = goal.current_amount >= goal.target_amount;
                const isOverdue = days < 0;

                return (
                  <Card key={goal.id}>
                    <CardHeader
                      title={goal.name}
                      action={
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(goal)}
                            className="text-primary hover:bg-primary/10 p-2 rounded-lg transition"
                            title="Edit goal"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
                            title="Delete goal"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      }
                    />
                    <CardBody className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            ${goal.current_amount.toFixed(2)} / $
                            {goal.target_amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isCompleted ? "bg-success" : "bg-primary"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Status */}
                      {isCompleted ? (
                        <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                          <p className="text-sm text-success font-medium">
                            ✓ Goal completed!
                          </p>
                        </div>
                      ) : isOverdue ? (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-sm text-destructive font-medium">
                            ⚠️ Deadline passed
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            {days} days remaining
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Remaining
                          </p>
                          <p className="text-lg font-bold text-primary">
                            $
                            {Math.max(
                              0,
                              goal.target_amount - goal.current_amount,
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Progress
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {Math.min(percentage, 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>

                      {/* Add Funds Button */}
                      <Button
                        onClick={() => handleOpenFundsModal(goal.id)}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        <DollarSign size={16} />
                        Add Funds
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Goal" : "Create New Goal"}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"} Goal
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
            <p className="text-sm text-foreground">
              <strong>How it works:</strong> Set your target amount, add your starting amount, then use "Add Funds" on the goal card to increase your progress.
            </p>
          </div>

          <FormInput
            label="Goal Name"
            type="text"
            placeholder="e.g., Emergency Fund"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helpText="What are you saving for?"
            required
          />

          <FormInput
            label="Target Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.target_amount}
            onChange={(e) =>
              setFormData({ ...formData, target_amount: e.target.value })
            }
            helpText="The total amount you want to save"
            required
          />

          <FormInput
            label="Starting Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.starting_amount}
            onChange={(e) =>
              setFormData({ ...formData, starting_amount: e.target.value })
            }
            helpText="How much you've already saved for this goal"
            required
          />

          <FormInput
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            helpText="When do you want to achieve this goal?"
            required
          />
        </form>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        isOpen={isFundsModalOpen}
        onClose={() => setIsFundsModalOpen(false)}
        title="Add Funds to Goal"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsFundsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFunds} disabled={!fundsAmount || parseFloat(fundsAmount) <= 0}>
              Add Funds
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleAddFunds}>
          <FormInput
            label="Amount to Add"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={fundsAmount}
            onChange={(e) => setFundsAmount(e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">
            This amount will be added to your goal's current progress.
          </p>
        </form>
      </Modal>
    </>
  );
}
