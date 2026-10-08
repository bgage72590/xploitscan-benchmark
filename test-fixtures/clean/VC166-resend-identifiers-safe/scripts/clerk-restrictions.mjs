// One-off script: turns on Clerk's sign-up restrictions for the production
// instance. The secret key comes from the environment. VC166 must NOT fire.
const res = await fetch("https://api.clerk.com/v1/instance/restrictions", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    block_disposable_email_domains: true,
    ignore_dots_for_gmail_addresses: true,
  }),
});

if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
console.log("Restrictions updated");
