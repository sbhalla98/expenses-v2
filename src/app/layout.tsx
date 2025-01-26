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
  title: "Track Expenses",
  description: "Track your expenenses as a couple & get insights.",
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
          <main className="flex flex-row" data-vaul-drawer-wrapper>
            <Header />
            <section className="flex h-svh flex-1 flex-col items-center justify-center bg-white relative py-14 max-w-[400px] mx-auto overflow-hidden">
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
