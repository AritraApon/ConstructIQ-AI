import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastContainer } from "react-toastify";
import ConstructIQChatbot from "@/components/layout/ConstructIQChatbot";
import Footer from "@/components/layout/Footer";


const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

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
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="font-sans bg-[#020617] text-[#F8FAFC] min-h-screen selection:bg-[#10B981]/30 selection:text-[#10B981] flex flex-col justify-between overflow-x-hidden">


        <Navbar/>


        <main className="flex-grow w-full relative z-10">
          {children}
        </main>


        <ConstructIQChatbot/>
        <Footer/>
        <ToastContainer position="top-center" theme="dark"/>

      </body>
    </html>
  );
}