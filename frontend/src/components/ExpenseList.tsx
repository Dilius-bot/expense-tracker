import type { Expense } from "../types/expense";

interface ExpenseListProps {
  items: Expense[];
}

export default function ExpenseList({ items }: ExpenseListProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        История расходов
      </h2>

      {items.length > 0 ? (
        <div className="space-y-4">
          <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <li
                key={item.expense_id}
                className="py-2.5 flex justify-between items-center text-sm"
              >
                <span className="text-gray-700 font-medium">{item.title}</span>
                <span className="text-red-600 font-semibold">
                  -{item.amount} ₽
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-200 flex justify-between items-center font-bold text-gray-900">
            <span>Итого потрачено:</span>
            <span className="text-lg text-indigo-600">{totalAmount} ₽</span>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 py-6 text-sm">
          Список пуст. Добавьте первый расход!
        </p>
      )}
    </div>
  );
}
