import { useState } from "react";
import type { FormData } from "../types/expense";
import { createExpense } from "../services/api";

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [formData, setFormData] = useState<FormData>({ title: "", amount: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createExpense(formData);
      setFormData({ title: "", amount: 0 });
      onExpenseAdded();
    } catch (error) {
      console.error(error);
      alert("Не удалось сохранить расход");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-center justify-center py-12 space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Сохранение расхода...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Добавить новый расход
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Название расхода:
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: Продукты"
            required
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Сумма:
          </label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={formData.amount || ""}
            onChange={handleChange}
            placeholder="0"
            required
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-2 text-sm"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
