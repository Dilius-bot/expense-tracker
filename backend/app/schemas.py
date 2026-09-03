from pydantic import BaseModel


class ExpenseCreateSchema(BaseModel):
    title: str
    amount: float


class ExpenseResponseSchema(BaseModel):
    expense_id: int
    title: str
    amount: float

    class Config:
        from_attributes = True
