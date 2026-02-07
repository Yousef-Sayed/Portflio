import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Cairo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Optimize fonts with subsets and display swap
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { color: "#3E5D75", media: "(prefers-color-scheme: light)" },
    { color: "#0d1520", media: "(prefers-color-scheme: dark)" },
  ],
};

const siteUrl = "https://portflio-new-iota.vercel.app/";
const siteName = "YTech Solutions";
const defaultTitle = "YTech Solutions | Professional Web Development";
const defaultDescription = "Professional web development services by YTech Solutions - Software Engineer specializing in React, Next.js, and modern web technologies. View our projects, skills, and get in touch.";
const ogImage = `${siteUrl}og-image.png`;
const twitterHandle = "@ytechsolutions";
const githubUrl = "https://github.com/Yousef-Sayed/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | YTech Solutions",
  },
  description: defaultDescription,
  keywords: [
    "YTech Solutions",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Web Development",
    "Portfolio",
    "Frontend Developer",
    "Backend Developer",
    "TypeScript",
    "Full Stack Developer",
    "Web Developer Egypt",
    "Freelance Developer",
  ],
  authors: [{ name: "Youssef Sayed", url: siteUrl }],
  creator: "YTech Solutions",
  publisher: "YTech Solutions",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: siteUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "YTech Solutions - Professional Web Development Portfolio",
        type: "image/png",
      },
      {
        url: `${siteUrl}og-image-square.png`,
        width: 1200,
        height: 1200,
        alt: "YTech Solutions - Web Developer Profile",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: twitterHandle,
    creator: twitterHandle,
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage],
  },
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ? {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  } : undefined,
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

// JSON-LD Structured Data - Organization
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}logo.png`,
  image: ogImage,
  description: defaultDescription,
  founder: {
    "@type": "Person",
    name: "Youssef Sayed",
    url: siteUrl,
  },
  foundingDate: "2020",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "youssefabdrabooh@gmail.com",
    contactType: "customer service",
    availableLanguage: ["English", "Arabic"],
  },
  sameAs: [
    githubUrl,
    "https://www.facebook.com/yousef.sayed.98434",
    "https://www.instagram.com/ytechsolutions/",
    "https://twitter.com/ytechsolutions",
  ],
  areaServed: "Worldwide",
  serviceType: "Web Development Services",
};

// JSON-LD Structured Data - WebSite
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}#website`,
  name: siteName,
  url: siteUrl,
  description: defaultDescription,
  publisher: {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}projects?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["en", "ar"],
};

// JSON-LD Structured Data - Person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}#person`,
  name: "Youssef Sayed",
  alternateName: ["Youssef Abdrabboh"],
  url: siteUrl,
  image: `${siteUrl}my-image.jpg`,
  jobTitle: "Software Engineer & Web Developer",
  description: "Professional Software Engineer specializing in React, Next.js, and modern web technologies.",
  sameAs: [
    githubUrl,
    "https://www.facebook.com/yousef.sayed.98434",
    "https://twitter.com/ytechsolutions",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Web Development",
    "Frontend Development",
    "Backend Development",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  email: "youssefabdrabooh@gmail.com",
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
          {/* Preconnect to external resources - Critical for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://images.unsplash.com" />
          
          {/* DNS prefetch for external resources */}
          <link rel="dns-prefetch" href="https://github.com" />
          <link rel="dns-prefetch" href="https://facebook.com" />
          <link rel="dns-prefetch" href="https://platform.twitter.com" />
          <link rel="dns-prefetch" href="https://api.clerk.com" />
          
          {/* Preload critical hero image */}
          <link 
            rel="preload" 
            href="/my-image-without-background.png" 
            as="image" 
            type="image/png" 
          />
          
          {/* PWA manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Favicon - Multiple sizes for different devices */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="mask-icon" href="/icon.svg" color="#3E5D75" />
          
          {/* Canonical URL */}
          <link rel="canonical" href={siteUrl} />
          
          {/* RSS Feed */}
          <link 
            rel="alternate" 
            type="application/rss+xml" 
            title="YTech Solutions RSS Feed" 
            href={`${siteUrl}rss.xml`} 
          />
          
          {/* JSON-LD Structured Data - Load with defer for non-blocking */}
          <Script
            id="organization-website-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([organizationJsonLd, websiteJsonLd, personJsonLd], null, 2),
            }}
            strategy="afterInteractive"
          />
          
          {/* Theme initialization script - Critical for preventing FOUC */}
          <Script
            id="theme-init"
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
            strategy="beforeInteractive"
          />
          
          {/* Defer non-critical analytics to lazyOnload */}
          {process.env.NEXT_PUBLIC_CLARITY_ID && (
            <Script
              id="clarity"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");
                `,
              }}
            />
          )}
        </head>
        <body
          className={`${inter.variable} ${cairo.variable} antialiased bg-background text-foreground transition-colors duration-300 font-sans`}
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
