import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const siteUrl = "https://portflio-new-iota.vercel.app/";
const siteName = "YTech Solutions";
const ogImage = `${siteUrl}og-image.png`;

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

// Lazy load below-the-fold components for better LCP and performance
const Hero = dynamic(() => import("@/components/Hero").then(mod => mod.Hero), {
  ssr: true,
  loading: () => <div className="min-h-screen animate-pulse bg-secondary/10" />
});

const About = dynamic(() => import("@/components/About").then(mod => mod.About), {
  ssr: true,
  loading: () => <div className="h-96 animate-pulse bg-secondary/10" />
});

const Portfolio = dynamic(() => import("@/components/Portfolio").then(mod => mod.Portfolio), {
  ssr: true,
  loading: () => <div className="h-96 animate-pulse bg-secondary/10" />
});

const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), {
  ssr: true,
  loading: () => <div className="h-96 animate-pulse bg-secondary/10" />
});

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Portfolio />
      <Contact />
    </>
  );
}
