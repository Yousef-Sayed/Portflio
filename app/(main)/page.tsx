import dynamic from 'next/dynamic';
import { Hero } from "@/components/Hero";

// Lazy load below-the-fold components
const About = dynamic(() => import("@/components/About").then(mod => mod.About), {
  loading: () => <div className="h-96 animate-pulse bg-secondary/10" />
});

const Portfolio = dynamic(() => import("@/components/Portfolio").then(mod => mod.Portfolio), {
  loading: () => <div className="h-96 animate-pulse bg-secondary/10" />
});

const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), {
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
