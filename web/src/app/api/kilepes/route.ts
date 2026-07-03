import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
