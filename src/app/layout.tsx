import Bottombar from "@/components/common/bottom-bar";
import Header from "@/components/common/header";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/lib/utils/react-query-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Track Expenses",
  description: "Track your expenses as a couple & get insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100">
        <ReactQueryProvider>
          <main
            className="flex flex-row"
            data-vaul-drawer-wrapper
            aria-label="Main Content"
          >
            <Header />
            <section
              className="flex h-svh flex-1 flex-col items-center justify-center bg-white relative py-14 max-w-[400px] mx-auto overflow-hidden"
              role="main"
            >
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
