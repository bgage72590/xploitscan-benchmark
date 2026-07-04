// Type guard using typeof — not a secret comparison.
// Scanner previously flagged this as "Timing-Unsafe Secret Comparison".
// VC043 must NOT fire.

interface Params {
  searchParams: { token?: string | string[] };
}

export default function ResetPasswordPage({ searchParams }: Params) {
  const token =
    typeof searchParams.token === "string" ? searchParams.token : "";
  return <ResetPasswordForm token={token} />;
}

function ResetPasswordForm({ token }: { token: string }) {
  return <form data-token={token} />;
}
