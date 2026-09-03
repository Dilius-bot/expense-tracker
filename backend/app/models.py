from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float
from app.database import Base


class ExpenseTable(Base):
    __tablename__ = "expenses"

    expense_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    amount: Mapped[float] = mapped_column(Float())
