from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
import os
import shutil
from pathlib import Path
from database import get_db
from schemas import CreateTransactionRequest, TransactionResponse
from dependencies import get_current_user
from ocr import BillAnalyzer

router = APIRouter(prefix="/transactions", tags=["transactions"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


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
            document_url=t.get("document_url"),
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
        "document_url": request.document_url,
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
        document_url=transaction_data.get("document_url"),
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
        "document_url": request.document_url,
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
        document_url=updated_transaction.get("document_url"),
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


@router.post("/{transaction_id}/upload-document")
async def upload_document(
    transaction_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a document/bill image for a transaction."""
    db = get_db()

    # Verify transaction exists and belongs to current user
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

    # Validate file type
    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_ext = Path(file.filename).suffix.lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"File type {file_ext} not allowed. Allowed: {', '.join(allowed_extensions)}",
        )

    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 10MB limit",
        )

    # Save file with unique name
    user_dir = UPLOAD_DIR / current_user["sub"]
    user_dir.mkdir(exist_ok=True)

    # Generate unique filename
    timestamp = datetime.utcnow().timestamp()
    file_name = f"{transaction_id}_{timestamp}{file_ext}"
    file_path = user_dir / file_name

    # Save file
    with open(file_path, "wb") as f:
        f.write(file_content)

    # Update transaction with document URL
    document_url = f"/uploads/{current_user['sub']}/{file_name}"
    await db.transactions.update_one(
        {"_id": ObjectId(transaction_id)},
        {"$set": {"document_url": document_url}},
    )

    return {
        "message": "Document uploaded successfully",
        "document_url": document_url,
        "filename": file.filename,
    }


@router.post("/analyze-bill")
async def analyze_bill(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Analyze a bill/receipt image or PDF to extract transaction data using OCR."""

    # Validate file type
    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_ext = Path(file.filename).suffix.lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"File type {file_ext} not allowed. Allowed: {', '.join(allowed_extensions)}",
        )

    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 10MB limit",
        )

    # Analyze bill using OCR
    try:
        analysis_result = await BillAnalyzer.analyze_bill(file_content, file.filename)

        return {
            "success": True,
            "data": analysis_result,
            "message": "Bill analysis completed successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing bill: {str(e)}",
        )
