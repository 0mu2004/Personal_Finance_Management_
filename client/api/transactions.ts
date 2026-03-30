import axiosClient from "./axiosClient";

export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  document_url?: string;
  created_at: string;
}

export interface CreateTransactionRequest {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  document_url?: string;
}

export interface OCRResult {
  amount: number | null;
  description: string | null;
  date: string | null;
  category: string;
  confidence: number;
  raw_text?: string;
}

export const transactionsAPI = {
  getTransactions: (params?: { category?: string; date?: string }) =>
    axiosClient.get<Transaction[]>("/transactions", { params }),

  createTransaction: (data: CreateTransactionRequest) =>
    axiosClient.post<Transaction>("/transactions", data),

  updateTransaction: (id: string, data: Partial<CreateTransactionRequest>) =>
    axiosClient.put<Transaction>(`/transactions/${id}`, data),

  deleteTransaction: (id: string) => axiosClient.delete(`/transactions/${id}`),

  uploadDocument: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post<{ message: string; document_url: string }>(
      `/transactions/${id}/upload-document`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  analyzeBill: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post<{ success: boolean; data: OCRResult; message: string }>(
      `/transactions/analyze-bill`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },
};
