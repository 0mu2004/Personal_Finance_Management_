from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from database import get_db
from schemas import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register a new user."""
    db = get_db()

    # Check if user already exists
    existing_user = await db.users.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    user_data = {
        "name": request.name,
        "email": request.email,
        "password": hash_password(request.password),
        "created_at": datetime.utcnow(),
    }

    result = await db.users.insert_one(user_data)
    user_id = str(result.inserted_id)

    # Create access token
    access_token = create_access_token(data={"sub": user_id, "email": request.email})

    return AuthResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id, name=request.name, email=request.email
        ),
    )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login user and return JWT token."""
    db = get_db()

    # Find user by email
    user = await db.users.find_one({"email": request.email})
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(user["_id"])

    # Create access token
    access_token = create_access_token(data={"sub": user_id, "email": request.email})

    return AuthResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id, name=user["name"], email=user["email"]
        ),
    )


from datetime import datetime
