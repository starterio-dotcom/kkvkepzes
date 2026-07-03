"use client";
import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="contact-card form-sent">
        <div className="form-sent-ico"><i className="ri-checkbox-circle-fill" /></div>
        <h3 className="h4">Köszönjük az üzeneted!</h3>
        <p className="body">Munkanapokon 24 órán belül válaszolunk a megadott e-mail-címre.</p>
        <button className="btn btn-outline" onClick={() => setSent(false)}><i className="ri-arrow-left-line" /> Új üzenet</button>
      </div>
    );
  }

  return (
    <form className="contact-card form-card" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <h2 className="h4" style={{ marginBottom: "var(--space-500)" }}>Írj nekünk</h2>
      <label className="auth-field"><span>Neved</span><input type="text" name="name" placeholder="Kovács Anna" required /></label>
      <label className="auth-field"><span>E-mail címed</span><input type="email" name="email" placeholder="nev@pelda.hu" required /></label>
      <label className="auth-field"><span>Tárgy</span><input type="text" name="subject" placeholder="Miről szeretnél kérdezni?" /></label>
      <label className="auth-field"><span>Üzenet</span><textarea name="message" rows={5} placeholder="Miben segíthetünk?" required /></label>
      <button type="submit" className="btn btn-primary btn-block btn-lg">Üzenet küldése</button>
    </form>
  );
}
