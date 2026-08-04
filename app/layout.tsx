import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Footer } from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://varshith.dev"),
  title: {
    default: "Varshith K - Software Engineer — Frontend",
    template: "%s - Varshith K",
  },
  description:
    "Software Engineer specializing in frontend engineering, enterprise SaaS, API contract design, Micro-Frontends, and product systems, with exposure to Node.js services.",
  openGraph: {
    title: "Varshith K - Software Engineer — Frontend",
    description:
      "Four years building enterprise products with React, TypeScript, Next.js, API contracts, Micro-Frontends, and hands-on distributed-system projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
