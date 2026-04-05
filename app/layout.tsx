import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/reusable-components/layout/Navbar";
import Footer from "@/reusable-components/layout/Footer";

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
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/apple-icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${allrounder.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen overflow-x-clip pt-20 md:pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}