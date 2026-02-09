// Mock API Client - Works entirely in the browser with localStorage
// No backend required!

interface MockResponse<T> {
  data: T;
}

class MockAxios {
  async get<T>(url: string, config?: any): Promise<MockResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.mockGet(url, config);
        resolve({ data: data as T });
      }, 100);
    });
  }

  async post<T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<MockResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.mockPost(url, data);
        resolve({ data: result as T });
      }, 100);
    });
  }

  async put<T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<MockResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.mockPut(url, data);
        resolve({ data: result as T });
      }, 100);
    });
  }

  async delete(url: string, config?: any): Promise<MockResponse<any>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockDelete(url);
        resolve({ data: { message: "Deleted successfully" } });
      }, 100);
    });
  }

  private mockGet(url: string, config?: any): any {
    if (url === "/transactions") {
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]",
      );
      return transactions;
    }
    if (url === "/budgets") {
      const budgets = JSON.parse(localStorage.getItem("budgets") || "[]");
      return this.calculateBudgetSpent(budgets);
    }
    if (url === "/goals") {
      return JSON.parse(localStorage.getItem("goals") || "[]");
    }
    if (url === "/dashboard/summary") {
      return this.calculateDashboardSummary();
    }
    return null;
  }

  private mockPost(url: string, data: any): any {
    if (url === "/auth/register") {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((u: any) => u.email === data.email);
      if (existingUser) throw new Error("Email already registered");

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
      };
      users.push({ ...newUser, password: data.password });
      localStorage.setItem("users", JSON.stringify(users));

      const token = "mock-token-" + Math.random().toString(36);
      return { access_token: token, user: newUser };
    }

    if (url === "/auth/login") {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: any) => u.email === data.email && u.password === data.password,
      );
      if (!user) throw new Error("Invalid email or password");

      const token = "mock-token-" + Math.random().toString(36);
      return {
        access_token: token,
        user: { id: user.id, name: user.name, email: user.email },
      };
    }

    if (url === "/transactions") {
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]",
      );
      const newTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: "user-1",
        ...data,
        created_at: new Date().toISOString(),
      };
      transactions.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      return newTransaction;
    }

    if (url === "/budgets") {
      const budgets = JSON.parse(localStorage.getItem("budgets") || "[]");
      const newBudget = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: "user-1",
        ...data,
        created_at: new Date().toISOString(),
      };
      budgets.push(newBudget);
      localStorage.setItem("budgets", JSON.stringify(budgets));
      return newBudget;
    }

    if (url === "/goals") {
      const goals = JSON.parse(localStorage.getItem("goals") || "[]");
      const newGoal = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: "user-1",
        ...data,
        created_at: new Date().toISOString(),
      };
      goals.push(newGoal);
      localStorage.setItem("goals", JSON.stringify(goals));
      return newGoal;
    }

    return null;
  }

  private mockPut(url: string, data: any): any {
    const id = url.split("/").slice(-2)[0];

    if (url.includes("/transactions/")) {
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]",
      );
      const index = transactions.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...data };
        localStorage.setItem("transactions", JSON.stringify(transactions));
        return transactions[index];
      }
    }

    if (url.includes("/budgets/")) {
      const budgets = JSON.parse(localStorage.getItem("budgets") || "[]");
      const index = budgets.findIndex((b: any) => b.id === id);
      if (index !== -1) {
        budgets[index] = { ...budgets[index], ...data };
        localStorage.setItem("budgets", JSON.stringify(budgets));
        return budgets[index];
      }
    }

    if (url.includes("/goals/")) {
      const goals = JSON.parse(localStorage.getItem("goals") || "[]");
      const index = goals.findIndex((g: any) => g.id === id);
      if (index !== -1) {
        // Handle add-funds endpoint
        if (url.includes("/add-funds")) {
          goals[index] = {
            ...goals[index],
            current_amount: goals[index].current_amount + data.amount,
          };
        } else {
          goals[index] = { ...goals[index], ...data };
        }
        localStorage.setItem("goals", JSON.stringify(goals));
        return goals[index];
      }
    }

    return null;
  }

  private mockDelete(url: string): void {
    const id = url.split("/").pop();

    if (url.includes("/transactions/")) {
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]",
      );
      const filtered = transactions.filter((t: any) => t.id !== id);
      localStorage.setItem("transactions", JSON.stringify(filtered));
    }

    if (url.includes("/budgets/")) {
      const budgets = JSON.parse(localStorage.getItem("budgets") || "[]");
      const filtered = budgets.filter((b: any) => b.id !== id);
      localStorage.setItem("budgets", JSON.stringify(filtered));
    }

    if (url.includes("/goals/")) {
      const goals = JSON.parse(localStorage.getItem("goals") || "[]");
      const filtered = goals.filter((g: any) => g.id !== id);
      localStorage.setItem("goals", JSON.stringify(filtered));
    }
  }

  private calculateBudgetSpent(budgets: any[]): any[] {
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]",
    );

    return budgets.map((budget: any) => {
      const spent = transactions
        .filter(
          (t: any) =>
            t.type === "expense" &&
            t.category === budget.category &&
            t.date.substring(0, 7) === budget.month,
        )
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      return {
        ...budget,
        spent,
      };
    });
  }

  private calculateDashboardSummary(): any {
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]",
    );

    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const savings = totalIncome - totalExpenses;

    const categoryBreakdown: { [key: string]: number } = {};
    transactions
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount;
      });

    const monthlySpending: { [key: string]: number } = {};
    transactions
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        const month = t.date.substring(0, 7);
        monthlySpending[month] = (monthlySpending[month] || 0) + t.amount;
      });

    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      savings,
      category_breakdown: categoryBreakdown,
      monthly_spending: Object.entries(monthlySpending).map(
        ([month, amount]) => ({
          month,
          amount,
        }),
      ),
    };
  }
}

const axiosClient = new MockAxios();

export default axiosClient;
