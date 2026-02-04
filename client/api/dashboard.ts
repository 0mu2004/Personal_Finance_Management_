import axiosClient from './axiosClient';

export interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  savings: number;
  category_breakdown: {
    [key: string]: number;
  };
  monthly_spending: {
    month: string;
    amount: number;
  }[];
}

export const dashboardAPI = {
  getSummary: () =>
    axiosClient.get<DashboardSummary>('/dashboard/summary'),
};
