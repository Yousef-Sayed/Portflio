import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

import { MainLayout } from "@/components/MainLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ytech-solutions.vercel.app"),
  title: {
    default: "YTech Solutions | Professional Web Development",
    template: "%s | YTech Solutions",
  },
  description: "Professional web development services by YTech Solutions - Software Engineer specializing in React, Next.js, and modern web technologies. View our projects, skills, and get in touch.",
  keywords: ["YTech Solutions", "Software Engineer", "React Developer", "Next.js", "Web Development", "Portfolio", "Frontend Developer", "Backend Developer"],
  authors: [{ name: "YTech Solutions" }],
  creator: "YTech Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    title: "YTech Solutions | Professional Web Development",
    description: "Professional web development services and portfolio showcasing modern web technologies.",
    siteName: "YTech Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "YTech Solutions | Professional Web Development",
    description: "Professional web development services and portfolio showcasing modern web technologies.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
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
                    var theme = localStorage.getItem('ytech-theme');
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
          <MainLayout>{children}</MainLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
