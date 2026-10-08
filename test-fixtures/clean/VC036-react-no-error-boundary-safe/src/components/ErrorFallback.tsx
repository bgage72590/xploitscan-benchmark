import type { FallbackProps } from "react-error-boundary";

// Generic message only — the error itself goes to the console/monitoring,
// never onto the page.
export function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-8 text-center">
      <h1 className="text-xl font-semibold">Something went wrong.</h1>
      <button onClick={resetErrorBoundary} className="mt-4 underline">
        Try again
      </button>
    </div>
  );
}
