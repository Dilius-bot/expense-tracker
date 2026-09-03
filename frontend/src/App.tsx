import { useState, useEffect } from "react"

interface Expense {
  expense_id: number
  title: string
  amount: number
}

interface FormData {
  title: string
  amount: number
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    amount: 0
  })
  const [expenses, setExpenses] = useState<Expense[]>([]) 
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value
    }))
  }

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/expenses")
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error("Ошибка при получении данных: ", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response = await fetch("http://127.0.0.1:8000/expenses/", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных!")
      }

      setFormData({
        title: "",
        amount: 0
      })

      await fetchExpenses()

    } catch(error) {
      console.error("Ошибка: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Добавить новый расход</h2>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Сохранение расхода...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Сумма:
              </label>
              <input 
                id="amount"
                type="number"
                name="amount"
                value={formData.amount || ''} 
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
        )}
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">История расходов</h2>
        
        {expenses.length > 0 ? (
          <div className="space-y-4">
            <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {expenses.map((item) => (
                <li key={item.expense_id} className="py-2.5 flex justify-between items-center text-sm">
                  <span className="text-gray-700 font-medium">{item.title}</span>
                  <span className="text-red-600 font-semibold">-{item.amount} ₽</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center font-bold text-gray-900">
              <span>Итого потрачено:</span>
              <span className="text-lg text-indigo-600">{totalAmount} ₽</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6 text-sm">Список пуст. Добавьте первый расход!</p>
        )}
      </div>
    </div>
  )
}

export default App
