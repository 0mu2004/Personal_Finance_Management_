from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from database import get_db
from schemas import CreateTransactionRequest, TransactionResponse
from dependencies import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=List[TransactionResponse])
async def get_transactions(
    category: Optional[str] = None,
    date: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
):
    """Get all transactions for the current user."""
    db = get_db()

    query = {"user_id": current_user["sub"]}
    if category:
        query["category"] = category
    if date:
        query["date"] = {"$regex": date}

    transactions = await db.transactions.find(query).to_list(None)

    return [
        TransactionResponse(
            id=str(t["_id"]),
            user_id=t["user_id"],
            type=t["type"],
            amount=t["amount"],
            category=t["category"],
            description=t.get("description"),
            date=t["date"],
            created_at=t["created_at"],
        )
        for t in transactions
    ]


@router.post("", response_model=TransactionResponse)
async def create_transaction(
    request: CreateTransactionRequest,
    current_user: dict = Depends(get_current_user),
):
    """Create a new transaction."""
    db = get_db()

    transaction_data = {
        "user_id": current_user["sub"],
        "type": request.type,
        "amount": request.amount,
        "category": request.category,
        "description": request.description,
        "date": request.date,
        "created_at": datetime.utcnow(),
    }

    result = await db.transactions.insert_one(transaction_data)

    return TransactionResponse(
        id=str(result.inserted_id),
        user_id=transaction_data["user_id"],
        type=transaction_data["type"],
        amount=transaction_data["amount"],
        category=transaction_data["category"],
        description=transaction_data["description"],
        date=transaction_data["date"],
        created_at=transaction_data["created_at"],
    )


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    request: CreateTransactionRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update a transaction."""
    db = get_db()

    transaction = await db.transactions.find_one(
        {
            "_id": ObjectId(transaction_id),
            "user_id": current_user["sub"],
        }
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    update_data = {
        "type": request.type,
        "amount": request.amount,
        "category": request.category,
        "description": request.description,
        "date": request.date,
    }

    await db.transactions.update_one(
        {"_id": ObjectId(transaction_id)},
        {"$set": update_data},
    )

    updated_transaction = await db.transactions.find_one(
        {"_id": ObjectId(transaction_id)}
    )

    return TransactionResponse(
        id=str(updated_transaction["_id"]),
        user_id=updated_transaction["user_id"],
        type=updated_transaction["type"],
        amount=updated_transaction["amount"],
        category=updated_transaction["category"],
        description=updated_transaction.get("description"),
        date=updated_transaction["date"],
        created_at=updated_transaction["created_at"],
    )


@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a transaction."""
    db = get_db()

    result = await db.transactions.delete_one(
        {
            "_id": ObjectId(transaction_id),
            "user_id": current_user["sub"],
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return {"message": "Transaction deleted successfully"}
