import type { Expense, FormData } from "../types/expense";

const BASE_URL = "http://127.0.0.1:8000/";

export const fetchExpensesApi = async (): Promise<Expense[]> => {
  const response = await fetch(`${BASE_URL}expenses/`);
  if (!response.ok) {
    throw new Error("Ошибка при получении данных от сервера");
  }
  return response.json();
};

export const createExpense = async (data: FormData): Promise<void> => {
  const response = await fetch(`${BASE_URL}expenses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Ошибка при отправке данных!");
  }
};

export const deleteExpenseByIDApi = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}expenses/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не удалось удалить расход");
  }
};

export const clearAllExpensesApi = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}expenses/clear/all/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не удалось очистить историю расходов");
  }
};
