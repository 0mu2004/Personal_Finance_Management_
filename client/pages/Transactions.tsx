import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionsAPI, Transaction } from "@/api/transactions";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardBody } from "@/components/Card";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { FormInput, FormSelect } from "@/components/FormInput";
import { Plus, Trash2, Edit2 } from "lucide-react";

const CATEGORIES = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transportation" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "salary", label: "Salary" },
  { value: "bonus", label: "Bonus" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" },
];

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const {
    data: transactions = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsAPI.getTransactions().then((res) => res.data),
  });

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingId(transaction.id);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: transaction.date.split("T")[0],
      });
    } else {
      setEditingId(null);
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await transactionsAPI.updateTransaction(editingId, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
      } else {
        await transactionsAPI.createTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionsAPI.deleteTransaction(id);
        refetch();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Transactions
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your income and expenses
              </p>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} />
              Add Transaction
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardBody>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">
                    Loading transactions...
                  </p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No transactions yet
                  </p>
                  <Button onClick={() => handleOpenModal()}>
                    Add your first transaction
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-foreground">
                          Amount
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-foreground">
                          Type
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-4 px-4 text-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-foreground">
                            {transaction.description}
                          </td>
                          <td
                            className={`py-4 px-4 text-right font-medium ${
                              transaction.type === "income"
                                ? "text-success"
                                : "text-foreground"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                transaction.type === "income"
                                  ? "bg-success/10 text-success"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {transaction.type.charAt(0).toUpperCase() +
                                transaction.type.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenModal(transaction)}
                                className="text-primary hover:bg-primary/10 p-2 rounded-lg transition"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Transaction" : "Add Transaction"}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"} Transaction
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <FormSelect
            label="Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "income" | "expense",
              })
            }
            options={[
              { value: "income", label: "Income" },
              { value: "expense", label: "Expense" },
            ]}
          />

          <FormInput
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />

          <FormSelect
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            options={CATEGORIES}
          />

          <FormInput
            label="Description"
            type="text"
            placeholder="What is this transaction for?"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <FormInput
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </form>
      </Modal>
    </>
  );
}
