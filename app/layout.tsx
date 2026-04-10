import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baby PC Mode",
  description:
    "Remote work helper that swaps your screen into a joyful baby-friendly keyboard playground.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

