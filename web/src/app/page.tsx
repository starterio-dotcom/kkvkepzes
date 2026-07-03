import { redirect } from "next/navigation";

// Egy kanonikus kezdőoldal: a fő landing.
export default function Home() {
  redirect("/hagyomanyos");
}
