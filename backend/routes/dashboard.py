from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from typing import List
from database import get_db
from schemas import DashboardSummary, MonthlySpendings
from dependencies import get_current_user
from collections import defaultdict

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    """Get dashboard summary with income, expenses, and charts data."""
    db = get_db()

    # Get all transactions for the user
    transactions = await db.transactions.find(
        {"user_id": current_user["sub"]}
    ).to_list(None)

    # Calculate totals
    total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
    total_expenses = sum(t["amount"] for t in transactions if t["type"] == "expense")
    savings = total_income - total_expenses

    # Calculate category breakdown
    category_breakdown = defaultdict(float)
    for t in transactions:
        if t["type"] == "expense":
            category_breakdown[t["category"]] += t["amount"]

    # Calculate monthly spending
    monthly_spending_dict = defaultdict(float)
    for t in transactions:
        if t["type"] == "expense":
            # Extract year-month from date
            month = t["date"][:7] if len(t["date"]) >= 7 else t["date"]
            monthly_spending_dict[month] += t["amount"]

    # Sort and format monthly spending
    monthly_spending = [
        MonthlySpendings(month=month, amount=amount)
        for month, amount in sorted(monthly_spending_dict.items())
    ]

    return DashboardSummary(
        total_income=total_income,
        total_expenses=total_expenses,
        savings=savings,
        category_breakdown=dict(category_breakdown),
        monthly_spending=monthly_spending,
    )
