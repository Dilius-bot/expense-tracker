from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import ExpenseTable
from app.schemas import ExpenseCreateSchema

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/")
async def add_expense(
    expense_data: ExpenseCreateSchema, db: AsyncSession = Depends(get_db)
):
    new_expense = ExpenseTable(title=expense_data.title, amount=expense_data.amount)
    db.add(new_expense)
    await db.commit()
    return {"message": "Расход успешно добавлен", "expense_id": new_expense.expense_id}


@router.get("/")
async def get_all_data(db: AsyncSession = Depends(get_db)):
    query = select(ExpenseTable)
    result = await db.execute(query)
    return result.scalars().all()
