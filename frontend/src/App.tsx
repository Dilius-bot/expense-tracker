import { useState, useEffect } from "react";
import type { Expense } from "./types/expense";
import { fetchExpensesApi } from "./services/api";
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

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
      <ExpenseForm onExpenseAdded={loadExpenses} />
      <ExpenseList items={expenses} />
    </div>
  );
}

export default App;
