import Bottombar from "@/components/common/bottom-bar";
import Header from "@/components/common/header";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/lib/utils/react-query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <ReactQueryProvider>
          <main className="flex flex-row">
            <Header />
            <section className="flex min-h-screen flex-1 flex-col items-center justify-center bg-gray-100 relative pb-20 pt-14 max-w-[400px] mx-auto">
              {children}
            </section>
            <Bottombar />
          </main>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
