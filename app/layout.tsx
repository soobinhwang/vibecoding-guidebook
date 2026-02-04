import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "PRD Generator for Solo Vibe Builders",
  description: "Generate AI-ready PRDs from a clean, guided template."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
