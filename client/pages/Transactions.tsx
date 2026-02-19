import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionsAPI, Transaction } from "@/api/transactions";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardBody } from "@/components/Card";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { FormInput, FormSelect } from "@/components/FormInput";
import { Plus, Trash2, Edit2, Upload, X } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    document_url: "" as string | undefined,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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
        document_url: transaction.document_url,
      });
      setFilePreview(transaction.document_url || null);
    } else {
      setEditingId(null);
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        document_url: undefined,
      });
      setFilePreview(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid file type (image or PDF)");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(file.name); // Show filename for PDFs
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    formData.document_url = undefined;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let transactionId = editingId;
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        document_url: formData.document_url,
      };

      if (editingId) {
        await transactionsAPI.updateTransaction(editingId, transactionData);
      } else {
        const response = await transactionsAPI.createTransaction(transactionData);
        transactionId = response.data.id;
      }

      // Upload file if selected
      if (selectedFile && transactionId) {
        try {
          setUploading(true);
          const uploadResponse = await transactionsAPI.uploadDocument(transactionId, selectedFile);
          setFormData({
            ...formData,
            document_url: uploadResponse.data.document_url,
          });
        } catch (uploadError) {
          console.error("Error uploading document:", uploadError);
          alert("Document uploaded failed, but transaction was saved");
        } finally {
          setUploading(false);
        }
      }

      setIsModalOpen(false);
      setSelectedFile(null);
      setFilePreview(null);
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
                        <th className="text-center py-3 px-4 font-medium text-foreground">
                          Document
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
                          <td className="py-4 px-4 text-center">
                            {transaction.document_url ? (
                              <a
                                href={transaction.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-xs font-medium"
                              >
                                <Upload size={14} />
                                View
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
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
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Uploading..." : editingId ? "Update" : "Add"} Transaction
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

          {/* File Upload Section */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bill/Document (Optional)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload an image or PDF of your bill as proof (Max 10MB)
            </p>

            {filePreview && !selectedFile ? (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-muted p-2 rounded text-sm text-muted-foreground truncate">
                  {filePreview.startsWith("http") || filePreview.startsWith("data:")
                    ? "Document attached"
                    : filePreview}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleRemoveFile}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : null}

            {selectedFile && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-muted p-2 rounded text-sm text-muted-foreground truncate">
                  {selectedFile.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleRemoveFile}
                >
                  <X size={16} />
                </Button>
              </div>
            )}

            {!selectedFile && !filePreview && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            )}

            {!selectedFile && !filePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted transition flex items-center justify-center gap-2 text-sm"
              >
                <Upload size={18} />
                <span>Click to upload or drag and drop</span>
              </button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
