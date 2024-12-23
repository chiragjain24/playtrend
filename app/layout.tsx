import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "PlayTrend",
  description: "Discover trending movies and web series",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script defer src="/stats/script.js" data-website-id="c74ca7d5-cc41-434f-a1b0-ad92a1ead73d"></Script>
      </head>
      <body
        className={`antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >

          {children}

          </ThemeProvider>
      </body>
    </html>
  );
}
