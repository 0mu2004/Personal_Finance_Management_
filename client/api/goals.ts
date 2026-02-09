import axiosClient from "./axiosClient";

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

export interface CreateGoalRequest {
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

export const goalsAPI = {
  getGoals: () => axiosClient.get<Goal[]>("/goals"),

  createGoal: (data: CreateGoalRequest) =>
    axiosClient.post<Goal>("/goals", data),

  updateGoal: (id: string, data: Partial<CreateGoalRequest>) =>
    axiosClient.put<Goal>(`/goals/${id}`, data),

  addFunds: (id: string, amount: number) =>
    axiosClient.put<Goal>(`/goals/${id}/add-funds`, { amount }),

  deleteGoal: (id: string) => axiosClient.delete(`/goals/${id}`),
};
