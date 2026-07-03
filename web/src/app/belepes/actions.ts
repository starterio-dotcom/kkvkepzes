"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, type SessionUser } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim() || "Kovács Anna";
  const method: SessionUser["method"] =
    (formData.get("method") as string) === "email" ? "email" : "ugyfelkapu";
  const vissza = (formData.get("vissza") as string) || "/";

  const user: SessionUser = {
    name,
    id: "u" + Math.floor(Date.now() / 1000),
    method,
    at: Date.now(),
  };
  const store = await cookies();
  store.set(SESSION_COOKIE, Buffer.from(JSON.stringify(user)).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect(vissza.startsWith("/") ? vissza : "/");
}
