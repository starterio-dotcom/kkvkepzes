"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <p className="newsletter-ok"><i className="ri-checkbox-circle-fill" /> Köszönjük! Feliratkoztál a hírlevélre.</p>
    );
  }
  return (
    <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <input type="email" placeholder="Az e-mail címed" aria-label="E-mail cím" required />
      <button className="btn btn-light" type="submit">Feliratkozom</button>
    </form>
  );
}
