"use client";

// Landing-page testimonials, loaded from the headless CMS over plain http://.
// The response can be rewritten in transit (e.g. on public Wi-Fi) to inject
// arbitrary quotes, names and image URLs into the marketing page.

import { useEffect, useState } from "react";

type Testimonial = { id: string; name: string; role: string; quote: string; avatarUrl: string };

const CMS_TESTIMONIALS_URL = "http://cms.skycast-app.com/api/testimonials?populate=avatar";

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch(CMS_TESTIMONIALS_URL)
      .then((res) => res.json())
      .then((json) => setItems(json.data));
  }, []);

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {items.map((t) => (
        <figure key={t.id} className="rounded-xl border p-6">
          <blockquote>“{t.quote}”</blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <img src={t.avatarUrl} alt={t.name} className="h-10 w-10 rounded-full" />
            <span>{t.name} · {t.role}</span>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
