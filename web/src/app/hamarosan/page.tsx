import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Hamarosan – KKV Képzés",
  description: "Ez a tartalom hamarosan elérhető lesz a KKV Képzés felületén.",
};

export default async function Page() {
  const user = await getSession();
  return (
    <>
      <Header user={user} />
      <main id="main" className="status-page">
        <div className="status-ico"><i className="ri-tools-line" /></div>
        <h1 className="h2">Hamarosan elérhető</h1>
        <p className="lead">Ezen az oldalon dolgozunk — nézz vissza később, vagy fedezd fel addig a képzéseket.</p>
        <div className="status-actions">
          <Link href="/kurzusok" className="btn btn-primary btn-lg"><i className="ri-book-open-line" /> Kurzusok</Link>
          <Link href="/hagyomanyos" className="btn btn-outline btn-lg">Vissza a kezdőoldalra</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
