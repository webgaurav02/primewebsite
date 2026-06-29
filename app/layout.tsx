import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/ui/PageLoader";
import CookieConsent from "@/components/ui/CookieConsent";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PRIME — Meghalaya's Hub for Entrepreneurs",
  description: "PRIME is Meghalaya's entrepreneurship hub supporting incubation, mentorship, training, funding, and networking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} scroll-smooth`}>
      <body className="bg-[#0a0a0a] text-[#e8e8e8] antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <PageLoader />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
