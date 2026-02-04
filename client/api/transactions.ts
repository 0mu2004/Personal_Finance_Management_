import axiosClient from './axiosClient';

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface CreateTransactionRequest {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const transactionsAPI = {
  getTransactions: (params?: { category?: string; date?: string }) =>
    axiosClient.get<Transaction[]>('/transactions', { params }),

  createTransaction: (data: CreateTransactionRequest) =>
    axiosClient.post<Transaction>('/transactions', data),

  updateTransaction: (id: string, data: Partial<CreateTransactionRequest>) =>
    axiosClient.put<Transaction>(`/transactions/${id}`, data),

  deleteTransaction: (id: string) =>
    axiosClient.delete(`/transactions/${id}`),
};
