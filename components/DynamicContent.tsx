"use client";

import dynamic from "next/dynamic";

const About = dynamic(() => import("@/components/About").then(mod => mod.About), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/20" />,
});

const Portfolio = dynamic(() => import("@/components/Portfolio").then(mod => mod.Portfolio), {
  loading: () => <div className="min-h-[600px] animate-pulse bg-muted/20" />,
});

const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/20" />,
});

export function DynamicContent() {
  return (
    <>
      <About />
      <Portfolio />
      <Contact />
    </>
  );
}
