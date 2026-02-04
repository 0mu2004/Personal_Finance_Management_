import axiosClient from './axiosClient';

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
  created_at: string;
}

export interface CreateBudgetRequest {
  category: string;
  limit: number;
  month: string;
}

export const budgetsAPI = {
  getBudgets: () =>
    axiosClient.get<Budget[]>('/budgets'),

  createBudget: (data: CreateBudgetRequest) =>
    axiosClient.post<Budget>('/budgets', data),

  updateBudget: (id: string, data: Partial<CreateBudgetRequest>) =>
    axiosClient.put<Budget>(`/budgets/${id}`, data),

  deleteBudget: (id: string) =>
    axiosClient.delete(`/budgets/${id}`),
};
