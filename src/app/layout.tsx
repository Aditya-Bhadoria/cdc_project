import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // imports Tailwind CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusStore",
  description: "Inventory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}