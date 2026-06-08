import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Empire — Simulation Financière",
  description: "Bâtissez votre empire financier. Simulation fictive — pas un conseil financier.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
