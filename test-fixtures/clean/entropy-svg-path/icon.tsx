// Inline SVG icon with a real path. The `d=` attribute is high-entropy
// coordinate data — never a secret. ENTROPY must not fire.

export function ShieldIcon() {
  const pathData = "M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5zm-1 15l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L18 10l-7 7z";

  return (
    <svg viewBox="0 0 24 24" width={24} height={24}>
      <path d={pathData} fill="currentColor" />
    </svg>
  );
}
