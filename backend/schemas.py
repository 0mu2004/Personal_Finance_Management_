from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List, Dict

# Auth Schemas
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    email: str

    class Config:
        populate_by_name = True


class AuthResponse(BaseModel):
    access_token: str
    user: UserResponse


# Transaction Schemas
class CreateTransactionRequest(BaseModel):
    type: str = Field(..., pattern="^(income|expense)$")
    amount: float = Field(..., gt=0)
    category: str
    description: Optional[str] = None
    date: str


class TransactionResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    type: str
    amount: float
    category: str
    description: Optional[str]
    date: str
    created_at: datetime

    class Config:
        populate_by_name = True


# Budget Schemas
class CreateBudgetRequest(BaseModel):
    category: str
    limit: float = Field(..., gt=0)
    month: str


class BudgetResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    category: str
    limit: float
    spent: float
    month: str
    created_at: datetime

    class Config:
        populate_by_name = True


# Goal Schemas
class CreateGoalRequest(BaseModel):
    name: str
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(..., ge=0)
    deadline: str


class GoalResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    name: str
    target_amount: float
    current_amount: float
    deadline: str
    created_at: datetime

    class Config:
        populate_by_name = True


# Dashboard Schemas
class CategoryBreakdown(BaseModel):
    category: str
    amount: float


class MonthlySpendings(BaseModel):
    month: str
    amount: float


class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    savings: float
    category_breakdown: Dict[str, float]
    monthly_spending: List[MonthlySpendings]
