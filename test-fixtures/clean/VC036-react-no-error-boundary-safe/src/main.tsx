import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import { ErrorFallback } from "./components/ErrorFallback";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error(error)}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
