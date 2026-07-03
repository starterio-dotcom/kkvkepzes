import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Az oldal nem található – KKV Képzés" };

export default function NotFound() {
  return (
    <>
      <Header user={null} />
      <main id="main" className="status-page">
        <div className="status-ico status-404"><i className="ri-compass-3-line" /></div>
        <p className="status-code">404</p>
        <h1 className="h2">Ez az oldal nem található</h1>
        <p className="lead">Lehet, hogy elavult a link, vagy elgépelted a címet. Innen tovább tudsz lépni:</p>
        <div className="status-actions">
          <Link href="/hagyomanyos" className="btn btn-primary btn-lg"><i className="ri-home-4-line" /> Kezdőoldal</Link>
          <Link href="/kurzusok" className="btn btn-outline btn-lg">Kurzusok</Link>
          <Link href="/elerhetosegek" className="btn btn-outline btn-lg">Kapcsolat</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
