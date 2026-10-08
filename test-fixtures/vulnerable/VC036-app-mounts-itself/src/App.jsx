import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import ExpenseForm from "./components/ExpenseForm";
import BalanceTable from "./components/BalanceTable";
import "./index.css";

// Single-file entry: index.html loads this module directly and it mounts
// itself at the bottom. Nothing wraps <App /> in an error boundary, so one
// component throwing during render (a malformed saved expense, say) unmounts
// the whole app and the user is left on a blank page.

function App() {
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem("expenses") ?? "[]"));

  const balances = useMemo(() => {
    const totals = {};
    for (const { paidBy, amount, splitWith } of expenses) {
      const share = amount / (splitWith.length + 1);
      totals[paidBy] = (totals[paidBy] ?? 0) + amount - share;
      for (const person of splitWith) totals[person] = (totals[person] ?? 0) - share;
    }
    return totals;
  }, [expenses]);

  const addExpense = (expense) => {
    const next = [...expenses, expense];
    setExpenses(next);
    localStorage.setItem("expenses", JSON.stringify(next));
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Expense Splitter</h1>
      <ExpenseForm onAdd={addExpense} />
      <BalanceTable balances={balances} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
