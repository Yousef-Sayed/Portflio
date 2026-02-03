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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yousef-abdrabboh.vercel.app"),
  title: {
    default: "Yousef Abdrabboh | Full-Stack Developer",
    template: "%s | Yousef Abdrabboh",
  },
  description: "Professional portfolio of Yousef Abdrabboh - Full-Stack Developer specializing in React, Next.js, and modern web technologies. View my projects, skills, and get in touch.",
  keywords: ["Full-Stack Developer", "React Developer", "Next.js", "Web Development", "Portfolio", "Yousef Abdrabboh", "Frontend Developer", "Backend Developer"],
  authors: [{ name: "Yousef Abdrabboh" }],
  creator: "Yousef Abdrabboh",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    title: "Yousef Abdrabboh | Full-Stack Developer",
    description: "Professional portfolio showcasing web development projects and skills.",
    siteName: "Yousef Abdrabboh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yousef Abdrabboh | Full-Stack Developer",
    description: "Professional portfolio showcasing web development projects and skills.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code if you have one
    // google: "your-verification-code",
  },
};

import { LazyMotion, domAnimation } from "framer-motion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/my-image-without-background.png" as="image" type="image/png" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3E5D75" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0d1520" media="(prefers-color-scheme: dark)" />
        
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
        {/* Theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('portfolio-theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
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
            <LazyMotion features={domAnimation}>
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
            </LazyMotion>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
