from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime
from typing import List
from database import get_db
from schemas import CreateGoalRequest, GoalResponse
from dependencies import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=List[GoalResponse])
async def get_goals(current_user: dict = Depends(get_current_user)):
    """Get all goals for the current user."""
    db = get_db()

    goals = await db.goals.find({"user_id": current_user["sub"]}).to_list(None)

    return [
        GoalResponse(
            id=str(g["_id"]),
            user_id=g["user_id"],
            name=g["name"],
            target_amount=g["target_amount"],
            current_amount=g["current_amount"],
            deadline=g["deadline"],
            created_at=g["created_at"],
        )
        for g in goals
    ]


@router.post("", response_model=GoalResponse)
async def create_goal(
    request: CreateGoalRequest,
    current_user: dict = Depends(get_current_user),
):
    """Create a new goal."""
    db = get_db()

    goal_data = {
        "user_id": current_user["sub"],
        "name": request.name,
        "target_amount": request.target_amount,
        "current_amount": request.current_amount,
        "deadline": request.deadline,
        "created_at": datetime.utcnow(),
    }

    result = await db.goals.insert_one(goal_data)

    return GoalResponse(
        id=str(result.inserted_id),
        user_id=goal_data["user_id"],
        name=goal_data["name"],
        target_amount=goal_data["target_amount"],
        current_amount=goal_data["current_amount"],
        deadline=goal_data["deadline"],
        created_at=goal_data["created_at"],
    )


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: str,
    request: CreateGoalRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update a goal."""
    db = get_db()

    goal = await db.goals.find_one(
        {
            "_id": ObjectId(goal_id),
            "user_id": current_user["sub"],
        }
    )

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )

    update_data = {
        "name": request.name,
        "target_amount": request.target_amount,
        "current_amount": request.current_amount,
        "deadline": request.deadline,
    }

    await db.goals.update_one(
        {"_id": ObjectId(goal_id)},
        {"$set": update_data},
    )

    updated_goal = await db.goals.find_one({"_id": ObjectId(goal_id)})

    return GoalResponse(
        id=str(updated_goal["_id"]),
        user_id=updated_goal["user_id"],
        name=updated_goal["name"],
        target_amount=updated_goal["target_amount"],
        current_amount=updated_goal["current_amount"],
        deadline=updated_goal["deadline"],
        created_at=updated_goal["created_at"],
    )


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a goal."""
    db = get_db()

    result = await db.goals.delete_one(
        {
            "_id": ObjectId(goal_id),
            "user_id": current_user["sub"],
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )

    return {"message": "Goal deleted successfully"}
