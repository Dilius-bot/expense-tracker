import { useState, useEffect } from "react";
import type { Expense } from "./types/expense";
import {
  fetchExpensesApi,
  deleteExpenseByIDApi,
  clearAllExpensesApi,
} from "./services/api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadExpenses = async () => {
    try {
      const data = await fetchExpensesApi();
      setExpenses(data);
    } catch (error) {
      console.error("Не удалось обновить список:", error);
    }
  };

  const handleDeleteByID = async (id: number) => {
    try {
      await deleteExpenseByIDApi(id);
      await loadExpenses();
    } catch (error: any) {
      if (error instanceof Error) {
        alert(`${error.message}`);
      }
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllExpensesApi();
      await loadExpenses();
    } catch (error: any) {
      if (error instanceof Error) {
        alert(`${error.message}`);
      }
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
      <ExpenseForm onExpenseAdded={loadExpenses} />
      <ExpenseList
        items={expenses}
        onDeleteByID={handleDeleteByID}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export default App;
