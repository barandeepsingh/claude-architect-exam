import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Claude Certified Architect — Mock Exam Portal",
  description: "Prepare for your Claude Certified Architect certification with our comprehensive mock exam portal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a2e] text-[#E2E8F0]">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#1a1a2e]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
