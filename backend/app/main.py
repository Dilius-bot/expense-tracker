from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy import String, Float, select
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = "postgresql+asyncpg://postgres:admin@localhost:5432/postgres"


engine = create_async_engine(DATABASE_URL, echo=True)


async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class ExpenseTable(Base):
    __tablename__ = "expenses"

    expense_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    amount: Mapped[float] = mapped_column(Float())


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

    await engine.dispose()


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExpenseCreateSchema(BaseModel):
    title: str
    amount: float


@app.post("/expenses/")
async def add_expense(expense_data: ExpenseCreateSchema):
    async with async_session() as session:
        new_expense = ExpenseTable(title=expense_data.title, amount=expense_data.amount)

        session.add(new_expense)

        await session.commit()

        return {
            "message": "Расход успешно добавлен",
            "expense_id": new_expense.expense_id,
        }


@app.get("/expenses/")
async def get_all_data():
    async with async_session() as session:
        query = select(ExpenseTable)

        result = await session.execute(query)

        expenses = result.scalars().all()

        return expenses


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
