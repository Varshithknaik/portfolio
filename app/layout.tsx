import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://varshith.dev"),
  title: {
    default: "Varshith K - Enterprise Frontend Engineer",
    template: "%s - Varshith K",
  },
  description:
    "Frontend Engineer building enterprise SaaS products, frontend platforms, design systems, and micro-frontend architecture.",
  openGraph: {
    title: "Varshith K - Enterprise Frontend Engineer",
    description:
      "Engineering portfolio for enterprise frontend architecture, technical writing, and interactive demos.",
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
