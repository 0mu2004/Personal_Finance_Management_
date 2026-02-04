from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime
from typing import List
from database import get_db
from schemas import CreateBudgetRequest, BudgetResponse
from dependencies import get_current_user

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("", response_model=List[BudgetResponse])
async def get_budgets(current_user: dict = Depends(get_current_user)):
    """Get all budgets for the current user."""
    db = get_db()

    budgets = await db.budgets.find({"user_id": current_user["sub"]}).to_list(None)

    # Calculate spent amount for each budget
    budget_responses = []
    for budget in budgets:
        # Get spending data for this budget
        transactions = await db.transactions.find(
            {
                "user_id": current_user["sub"],
                "category": budget["category"],
                "type": "expense",
                "date": {"$regex": budget["month"]},
            }
        ).to_list(None)

        spent = sum(t["amount"] for t in transactions)

        budget_responses.append(
            BudgetResponse(
                id=str(budget["_id"]),
                user_id=budget["user_id"],
                category=budget["category"],
                limit=budget["limit"],
                spent=spent,
                month=budget["month"],
                created_at=budget["created_at"],
            )
        )

    return budget_responses


@router.post("", response_model=BudgetResponse)
async def create_budget(
    request: CreateBudgetRequest,
    current_user: dict = Depends(get_current_user),
):
    """Create a new budget."""
    db = get_db()

    # Check if budget already exists for this category and month
    existing = await db.budgets.find_one(
        {
            "user_id": current_user["sub"],
            "category": request.category,
            "month": request.month,
        }
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budget already exists for this category and month",
        )

    budget_data = {
        "user_id": current_user["sub"],
        "category": request.category,
        "limit": request.limit,
        "month": request.month,
        "created_at": datetime.utcnow(),
    }

    result = await db.budgets.insert_one(budget_data)

    return BudgetResponse(
        id=str(result.inserted_id),
        user_id=budget_data["user_id"],
        category=budget_data["category"],
        limit=budget_data["limit"],
        spent=0,
        month=budget_data["month"],
        created_at=budget_data["created_at"],
    )


@router.put("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: str,
    request: CreateBudgetRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update a budget."""
    db = get_db()

    budget = await db.budgets.find_one(
        {
            "_id": ObjectId(budget_id),
            "user_id": current_user["sub"],
        }
    )

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    update_data = {
        "category": request.category,
        "limit": request.limit,
        "month": request.month,
    }

    await db.budgets.update_one(
        {"_id": ObjectId(budget_id)},
        {"$set": update_data},
    )

    updated_budget = await db.budgets.find_one({"_id": ObjectId(budget_id)})

    # Calculate spent amount
    transactions = await db.transactions.find(
        {
            "user_id": current_user["sub"],
            "category": updated_budget["category"],
            "type": "expense",
            "date": {"$regex": updated_budget["month"]},
        }
    ).to_list(None)

    spent = sum(t["amount"] for t in transactions)

    return BudgetResponse(
        id=str(updated_budget["_id"]),
        user_id=updated_budget["user_id"],
        category=updated_budget["category"],
        limit=updated_budget["limit"],
        spent=spent,
        month=updated_budget["month"],
        created_at=updated_budget["created_at"],
    )


@router.delete("/{budget_id}")
async def delete_budget(
    budget_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a budget."""
    db = get_db()

    result = await db.budgets.delete_one(
        {
            "_id": ObjectId(budget_id),
            "user_id": current_user["sub"],
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    return {"message": "Budget deleted successfully"}
