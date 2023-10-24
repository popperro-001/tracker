import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Topbar from "@/components/shared/Topbar";
import Provider from "@/components/shared/Provider";
import Sidebar from "@/components/shared/Sidebar";
import Bottombar from "@/components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlanItTrack",
  description: "Helps plan and track your daily activity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="app">
            <Sidebar />
            <section className="main-container">
            <Topbar />
              <div className="w-full">
                {children}
              </div>
            </section>
            <Bottombar />
          </main>
        </Provider>
      </body>
    </html>
  );
}
