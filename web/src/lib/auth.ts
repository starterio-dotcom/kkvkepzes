// SZERVER-oldali session (Ügyfélkapu+ SSO – demó szimuláció).
// Éles: aláírt token / OIDC IdP (Keycloak → KAÜ). Itt httpOnly cookie, base64 JSON.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "kkv_session";

export type SessionUser = {
  name: string;
  id: string;
  method: "ugyfelkapu" | "email";
  at: number;
};

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

/** Tanulási oldalakhoz: ha nincs belépve, átirányít az Ügyfélkapu+ belépésre. */
export async function requireAuth(vissza: string): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect(`/belepes?vissza=${encodeURIComponent(vissza)}`);
  return user;
}
