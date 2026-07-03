import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kkvkepzes.gov.hu"),
  title: {
    default: "KKV Képzés – Ingyenes közbeszerzési képzés",
    template: "%s | KKV Képzés",
  },
  description:
    "Ingyenes, nyilvántartott felnőttképzés a közbeszerzési eljárások gyakorlati elsajátításához. Digitális Állampolgárság Program.",
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: "KKV Képzés",
    title: "KKV Képzés – Ingyenes közbeszerzési képzés",
    description: "Tanuld meg a közbeszerzést a gyakorlatban — ingyen, saját tempóban, letölthető oklevéllel.",
    images: [{ url: "/covers/merleg.webp", width: 1920, height: 800 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Ugrás a tartalomra</a>
        {children}
      </body>
    </html>
  );
}
