import type { Metadata } from "next";
import { Host_Grotesk, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/ui/PageLoader";
import CookieConsent from "@/components/ui/CookieConsent";
import PageTransition from "@/components/ui/PageTransition";
import FloatingWidgets from "@/components/ui/FloatingWidgets";
import Analytics from "@/components/analytics/Analytics";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PRIME — Meghalaya's Hub for Entrepreneurs",
  description: "PRIME is Meghalaya's entrepreneurship hub supporting incubation, mentorship, training, funding, and networking.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png",          sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${cormorant.variable} scroll-smooth`}>
      <body className="bg-white text-black antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <PageLoader />
        <PageTransition>{children}</PageTransition>
        <CookieConsent />
        <FloatingWidgets />
        <Analytics />
      </body>
    </html>
  );
}
