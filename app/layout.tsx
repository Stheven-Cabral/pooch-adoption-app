import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Caveat, Inter } from "next/font/google";

const caveat = Caveat({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});
const inter = Inter({
  subsets: [
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
    "latin",
    "latin-ext",
    "vietnamese",
  ],
});

export const metadata: Metadata = {
  title: "Pooch Finder",
  description: "Find your next best friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${caveat.className} ${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
