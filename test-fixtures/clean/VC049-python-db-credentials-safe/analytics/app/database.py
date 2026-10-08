# Async SQLAlchemy engine for the FastAPI analytics service. The connection
# URL is read from the environment.

import os

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DATABASE_URL = os.environ["DATABASE_URL"]  # e.g. postgresql+asyncpg://user:pass@host/db, set in the deploy env

engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with SessionLocal() as session:
        yield session
