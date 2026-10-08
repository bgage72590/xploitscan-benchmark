// Site footer with a newsletter signup. The form posts the visitor's email
// address to an http:// endpoint, so it is sent in cleartext — and the
// browser flags the form as "not secure".

export function Footer() {
  return (
    <footer className="border-t py-10">
      <form action="http://api.skycast-app.com/newsletter/subscribe" method="post" className="flex gap-2">
        <input type="email" name="email" placeholder="you@example.com" required />
        <button type="submit">Subscribe</button>
      </form>
      <a href="https://twitter.com/skycast" aria-label="SkyCast on X">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2z" />
        </svg>
      </a>
    </footer>
  );
}
