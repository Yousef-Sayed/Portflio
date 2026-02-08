import type { Metadata } from 'next';

const siteUrl = "https://portflio-new-iota.vercel.app/";
const siteName = "YTech Solutions";
const ogImage = `${siteUrl}og-image.png`;

// Disable static generation to avoid Convex prerendering issues
export const dynamic = 'force-dynamic';

// SEO: Enhanced metadata for main page with comprehensive Open Graph and Twitter cards
export const metadata: Metadata = {
  title: {
    default: `${siteName} | Professional Web Development Services`,
    template: "%s | YTech Solutions",
  },
  description: `${siteName} - Professional Software Engineer specializing in React, Next.js, TypeScript, and modern web technologies. View our portfolio of innovative projects, skills, and contact us for your web development needs.`,
  keywords: [
    "web development",
    "react developer",
    "next.js developer",
    "software engineer",
    "frontend developer",
    "full stack developer",
    "typescript",
    "web portfolio",
    "professional web services",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | Professional Web Development Services`,
    description: "Professional Software Engineer specializing in React, Next.js, and modern web technologies. View our portfolio of innovative projects.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "YTech Solutions - Web Development Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ytechsolutions",
    creator: "@ytechsolutions",
    title: `${siteName} | Professional Web Development Services`,
    description: "Professional Software Engineer specializing in React, Next.js, and modern web technologies.",
    images: [ogImage],
  },
};

import { Hero } from "@/components/Hero";
import { DynamicContent } from "@/components/DynamicContent";

export default function Home() {
  return (
    <>
      <Hero />
      <DynamicContent />
    </>
  );
}
