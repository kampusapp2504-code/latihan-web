import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nusa Commerce | Sales Intelligence",
  description: "Realtime sales command center",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}
