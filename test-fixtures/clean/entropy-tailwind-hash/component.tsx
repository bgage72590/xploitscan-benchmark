// React component with inlined Tailwind JIT class-name fingerprints.
// These look high-entropy (css-2kx3yr8, tw-abc12def) but are build artifacts,
// not secrets. ENTROPY must not fire.

export function Button({ label }: { label: string }) {
  const buttonClass = "css-2kx3yr8wPmnT4xXfVcJz9LqRyKpUaBbDdEeFfGg1";
  const iconClass = "tw-abc12def34ghi56jkl78mno90pqr12stu34vwx";
  const wrapperClass = "jss-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0";

  return (
    <button className={`${buttonClass} ${iconClass}`}>
      <span className={wrapperClass}>{label}</span>
    </button>
  );
}
