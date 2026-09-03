import type { Expense, FormData } from "../types/expense"

const BASE_URL = "http://127.0.0.1:8000/"

export const fetchExpensesApi = async (): Promise<Expense[]> => {
    const response = await fetch(`${BASE_URL}expenses/`)
    if (!response.ok) {
        throw new Error("Ошибка при получении данных от сервера")
    }
    return response.json()
}

export const createExpense = async (data: FormData): Promise<void> => {
    const response = await fetch("http://127.0.0.1:8000/expenses/", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных!")
      }
}