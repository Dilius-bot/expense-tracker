from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
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


@router.delete("/{expense_id}/")
async def delete_expense_by_id(expense_id: int, db: AsyncSession = Depends(get_db)):
    expense = await db.get(ExpenseTable, expense_id)

    if not expense:
        raise HTTPException(status_code=404, detail="Расход не найден")

    await db.delete(expense)
    await db.commit()

    return {"message": f"Расход с ID {expense_id} успешно удалён"}


@router.delete("/clear/all")
async def delete_all_expenses(db: AsyncSession = Depends(get_db)):
    query = delete(ExpenseTable)
    await db.execute(query)
    await db.commit()

    return {"message": "Все расходы успешно удалены из базы"}
