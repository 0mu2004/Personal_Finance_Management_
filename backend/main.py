from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
from dotenv import load_dotenv

# Import database functions
from database import connect_db, disconnect_db

# Import routers
from routes import auth, transactions, budgets, goals, dashboard

# Load environment variables
load_dotenv()

# Create FastAPI application
app = FastAPI(
    title="FinTrack API",
    description="A comprehensive personal finance tracker API",
    version="1.0.0",
)

# Configure CORS
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:8080"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for serving uploaded files
upload_dir = Path("uploads")
upload_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Lifespan events
@app.on_event("startup")
async def startup():
    """Initialize database connection on startup."""
    await connect_db()


@app.on_event("shutdown")
async def shutdown():
    """Close database connection on shutdown."""
    await disconnect_db()


# Include routers
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(goals.router)
app.include_router(dashboard.router)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "FinTrack API is running"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to FinTrack API",
        "docs": "/docs",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
