"use client";

import dynamic from "next/dynamic";
import { LazySection } from "@/components/LazySection";

// Skeleton loaders for below-the-fold content
const SectionSkeleton = ({ minHeight = "400px" }: { minHeight?: string }) => (
  <div className={`animate-pulse bg-muted/20`} style={{ minHeight }} />
);

// Dynamically import below-the-fold components with deferred loading
const About = dynamic(() => import("@/components/About").then(mod => mod.About), {
  loading: () => <SectionSkeleton minHeight="400px" />,
  ssr: false, // Defer to client-side only to reduce initial bundle
});

const Portfolio = dynamic(() => import("@/components/Portfolio").then(mod => mod.Portfolio), {
  loading: () => <SectionSkeleton minHeight="600px" />,
  ssr: false,
});

const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), {
  loading: () => <SectionSkeleton minHeight="400px" />,
  ssr: false,
});

export function DynamicContent() {
  return (
    <>
      <LazySection minHeight="400px" rootMargin="600px">
        <About />
      </LazySection>
      <LazySection minHeight="600px" rootMargin="400px">
        <Portfolio />
      </LazySection>
      <LazySection minHeight="400px" rootMargin="200px">
        <Contact />
      </LazySection>
    </>
  );
}
