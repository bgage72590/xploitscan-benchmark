# Async SQLAlchemy engine for the FastAPI analytics service. The connection
# URL, password included, is hardcoded.

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DATABASE_URL = "postgresql+asyncpg://analytics:Hn3kQ9vXw2pT@analytics-db.internal.example.com:5432/analytics"

engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with SessionLocal() as session:
        yield session
