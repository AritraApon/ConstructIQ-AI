import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastContainer } from "react-toastify";
import ConstructIQChatbot from "@/components/layout/ConstructIQChatbot";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ConstructIQ AI - Next-Gen Cost Estimation",
  description: "AI-powered cost estimation and project intelligence for civil engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <body className="font-sans bg-[#020617] text-[#F8FAFC] min-h-screen selection:bg-[#10B981]/30 selection:text-[#10B981] flex flex-col justify-between overflow-x-hidden">
        <Navbar />

        <main className="flex-grow w-full relative z-10">
          {children}
        </main>

        <ConstructIQChatbot />
        <Footer />
        <ToastContainer position="bottom-left" theme="dark" />
      </body>
    </html>
  );
}