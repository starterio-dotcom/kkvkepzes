import Link from "next/link";
import { loginAction } from "./actions";

export const metadata = { title: "Belépés", robots: { index: false } };

export default async function Belepes({
  searchParams,
}: {
  searchParams: Promise<{ vissza?: string }>;
}) {
  const { vissza } = await searchParams;
  const back = vissza && vissza.startsWith("/") ? vissza : "/";

  return (
    <main id="main" className="auth">
      <form className="auth-card" action={loginAction}>
        <div className="brand" style={{ justifyContent: "center", marginBottom: "var(--space-500)" }}>
          <span className="mark"><i className="ri-graduation-cap-fill" /></span>
          <span className="wm">
            <b>KKV Képzés</b>
            <span>Központi Azonosítás</span>
          </span>
        </div>

        <h1 className="h4" style={{ textAlign: "center" }}>Azonosítás</h1>
        <p className="meta" style={{ textAlign: "center", marginBottom: "var(--space-600)" }}>
          Lépj be, hogy hozzáférj a képzéshez. A beiratkozáshoz Ügyfélkapu+ azonosítás szükséges.
        </p>

        <input type="hidden" name="vissza" value={back} />

        <div className="auth-methods">
          <label className="auth-method">
            <input type="radio" name="method" value="ugyfelkapu" defaultChecked />
            <span className="auth-method-body">
              <i className="ri-government-line" />
              <span>
                <b>Ügyfélkapu+</b>
                <em>Ajánlott · egy lépésben, gépelés nélkül</em>
              </span>
            </span>
          </label>
          <label className="auth-method">
            <input type="radio" name="method" value="email" />
            <span className="auth-method-body">
              <i className="ri-mail-line" />
              <span>
                <b>E-mail-cím</b>
                <em>Tartalék · ha nincs Ügyfélkapu</em>
              </span>
            </span>
          </label>
        </div>

        <label className="auth-field">
          <span>Neved (a bemutatóhoz)</span>
          <input name="name" type="text" placeholder="pl. Kovács Anna" autoComplete="name" />
        </label>

        <button type="submit" className="btn btn-primary btn-block btn-lg">
          <i className="ri-shield-check-line" /> Belépés
        </button>

        <p className="auth-note">
          <i className="ri-information-line" /> Bemutató: a valódi Ügyfélkapu+ (KAÜ) helyett
          szimulált belépés. Éles rendszerben OIDC/SAML federáció (Keycloak → KAÜ).
        </p>
        <Link href={back} className="auth-back"><i className="ri-arrow-left-line" /> Vissza</Link>
      </form>
    </main>
  );
}
