from motor.motor_asyncio import AsyncClient, AsyncDatabase
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "fintrack")

# Async client for FastAPI
client: AsyncClient = None
db: AsyncDatabase = None


async def connect_db():
    global client, db
    client = AsyncClient(MONGO_URI)
    db = client[DATABASE_NAME]
    print("Connected to MongoDB")


async def disconnect_db():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")


def get_db():
    return db
