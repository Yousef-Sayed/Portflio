import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google"; // Import Cairo for Arabic
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo", // New variable for Arabic font
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yousef Abdrabboh | Full-Stack Developer",
  description: "Professional portfolio of Yousef Abdrabboh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('portfolio-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} antialiased bg-background text-foreground transition-colors duration-300 font-sans`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
            {/* Note: User must run 'npx convex dev' to generate the URL */}
            {process.env.NEXT_PUBLIC_CONVEX_URL ? (
              <ConvexClientProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </ConvexClientProvider>
            ) : (
              <>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </>
            )}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
