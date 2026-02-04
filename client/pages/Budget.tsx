import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { budgetsAPI, Budget } from '@/api/budgets';
import { Navbar } from '@/components/Navbar';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { FormInput, FormSelect } from '@/components/FormInput';
import { Plus, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' },
];

export default function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: new Date().toISOString().slice(0, 7),
  });

  const { data: budgets = [], refetch, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetsAPI.getBudgets().then((res) => res.data),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await budgetsAPI.createBudget({
        ...formData,
        limit: parseFloat(formData.limit),
      });
      setIsModalOpen(false);
      setFormData({
        category: '',
        limit: '',
        month: new Date().toISOString().slice(0, 7),
      });
      refetch();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetsAPI.deleteBudget(id);
        refetch();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget</h1>
              <p className="text-muted-foreground mt-2">
                Set and track spending limits by category
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Add Budget
            </Button>
          </div>

          {/* Budgets Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-muted-foreground mb-4">No budgets created yet</p>
                <Button onClick={() => setIsModalOpen(true)}>
                  Create your first budget
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isExceeded = budget.spent > budget.limit;

                return (
                  <Card key={budget.id}>
                    <CardHeader
                      title={budget.category}
                      action={
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      }
                    />
                    <CardBody className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Spending</span>
                          <span className={`text-sm font-medium ${isExceeded ? 'text-destructive' : 'text-foreground'}`}>
                            ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(budget.spent, budget.limit)} transition-all`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {isExceeded && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-sm text-destructive font-medium">
                            ⚠️ Budget exceeded by ${(budget.spent - budget.limit).toFixed(2)}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                          <p className={`text-lg font-bold ${budget.spent > budget.limit ? 'text-destructive' : 'text-success'}`}>
                            ${Math.max(0, budget.limit - budget.spent).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Used</p>
                          <p className="text-lg font-bold text-foreground">
                            {percentage.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Budget"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Budget
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <FormSelect
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={CATEGORIES}
          />

          <FormInput
            label="Budget Limit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            required
          />

          <FormInput
            label="Month"
            type="month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            required
          />
        </form>
      </Modal>
    </>
  );
}
