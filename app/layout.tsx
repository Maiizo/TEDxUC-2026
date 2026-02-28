import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const allrounder = localFont({
  src: [
    {
      path: "./font/AllrounderMonumentTest-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font/AllrounderMonumentTest-Book.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./font/AllrounderMonumentTest-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-allrounder",
});

export const metadata: Metadata = {
  title: "TEDxUC 2026",
  description: "TEDxUC 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${allrounder.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}