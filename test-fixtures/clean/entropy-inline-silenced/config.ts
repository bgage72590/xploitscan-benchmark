// Paired with vulnerable/entropy-unsilenced-control, which holds the SAME
// literal without a marker and must still fire.
export const siteMeta = {
  // ENTROPY-OK: Search Console verification token. Next.js renders this into
  // the public <head>, so it is a published identifier by construction — not
  // a credential. The explanation deliberately wraps across several lines,
  // because that is what a real justification looks like and the marker has
  // to survive it.
  verificationToken: "Kp7QvX2mLd9RtY4nBz6WcH8fJ3sA5gE1uT0iO2yPqNr",
};
