import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import ExpenseForm from "./components/ExpenseForm";
import BalanceTable from "./components/BalanceTable";
import "./index.css";

// Single-file entry that mounts itself, with the whole tree inside an error
// boundary: a render crash shows a generic message (never the error) and
// offers to clear the saved data that caused it.

function Fallback({ resetErrorBoundary }) {
  return (
    <div role="alert" className="p-8 text-center">
      <p>Something went wrong.</p>
      <button
        onClick={() => {
          localStorage.removeItem("expenses");
          resetErrorBoundary();
        }}
      >
        Reset saved expenses
      </button>
    </div>
  );
}

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
    <ErrorBoundary FallbackComponent={Fallback} onError={(error) => console.error(error)}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
