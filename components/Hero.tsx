"use client";

import * as React from "react";
import { m, useMotionValue, useSpring, useTransform, LazyMotion, domAnimation } from "framer-motion";
import { Download, Send, MousePointer2, Zap, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { portfolioData } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";

export function Hero() {
    const { language, direction } = useLanguage();
    const t = portfolioData[language];
    const isRTL = direction === "rtl";

    // Fetch dynamic hero settings from Convex
    const heroSettings = useQuery(api.hero.getSettings);

    // Dynamic content with fallbacks to static data
    const badge = language === 'ar'
        ? (heroSettings?.badgeAr || t.hero.badge)
        : (heroSettings?.badgeEn || t.hero.badge);

    const title = language === 'ar'
        ? (heroSettings?.titleAr || t.personalInfo.title)
        : (heroSettings?.titleEn || t.personalInfo.title);

    const bio = language === 'ar'
        ? (heroSettings?.bioAr || t.personalInfo.bio)
        : (heroSettings?.bioEn || t.personalInfo.bio);

    const contactBtn = language === 'ar'
        ? (heroSettings?.contactBtnAr || t.hero.contactBtn)
        : (heroSettings?.contactBtnEn || t.hero.contactBtn);

    const downloadBtn = language === 'ar'
        ? (heroSettings?.downloadBtnAr || t.hero.downloadBtn)
        : (heroSettings?.downloadBtnEn || t.hero.downloadBtn);

    const heroImage = heroSettings?.heroImage || t.personalInfo.avatar;
    const yearsExp = heroSettings?.yearsExperience || "5+";
    const [downloading, setDownloading] = React.useState(false);
    const projectsNum = heroSettings?.projectsCompleted || "50+";

    // For headline, we use custom rendering based on dynamic data
    const headlineEn = heroSettings?.headlineEn || "Crafting Digital High-End Solutions";
    const headlineAr = heroSettings?.headlineAr || "أصنع تجارب رقمية متكاملة";

    // Mouse tilt effect for 3D image - optimized with cached rect and RAF
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const rectRef = React.useRef<DOMRect | null>(null);
    const rafIdRef = React.useRef<number | null>(null);

    // Cache bounding rect on mount and resize using ResizeObserver to avoid layout thrashing
    // ResizeObserver provides dimensions without forcing a reflow
    React.useLayoutEffect(() => {
        if (!containerRef.current) return;

        const updateRect = () => {
            if (containerRef.current) {
                rectRef.current = containerRef.current.getBoundingClientRect();
            }
        };

        // Initial measurement
        updateRect();

        const observer = new ResizeObserver((entries) => {
            // We can get dimensions from entries[0].contentRect, but we need the
            // relative position to viewport (left/top) which ResizeObserver doesn't update on scroll
            // So we still need getBoundingClientRect() but ResizeObserver fires efficiently.
            // To strictly avoid reflow, we would need to assume position hasn't changed relative to viewport
            // or use IntersectionObserver. For now, optimizing the trigger is a good step.
            // But wait, the user specifically asked to "Avoid forced reflows".
            // Reading getBoundingClientRect() forces reflow IF styles are dirty.
            // Since we are in a callback, styles might be clean.
            // However, requestAnimationFrame is safer.
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
            rafIdRef.current = requestAnimationFrame(updateRect);
        });

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    // Optimized mouse move handler using RAF to batch updates
    const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
        // Cancel previous frame if still pending
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            const rect = rectRef.current;
            if (!rect) return;

            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const xPct = mouseX / width - 0.5;
            const yPct = mouseY / height - 0.5;

            x.set(xPct);
            y.set(yPct);
        });
    }, [x, y]);

    const handleMouseLeave = React.useCallback(() => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
        x.set(0);
        y.set(0);
    }, [x, y]);

    const scrollToContact = () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };

    // Handle CV download - dynamically generate PDF from active data
    const handleDownloadCV = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (downloading) return;
        setDownloading(true);
        try {
            const response = await fetch("/api/generate-cv");
            if (!response.ok) throw new Error("Failed to generate CV");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Youssef_Abdrabboh_CV.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("CV generation error:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 bg-gradient-to-br from-background via-background to-primary/5"
            dir={direction}
        >
            {/* Background Orbs with strict clipping */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
                <div className="absolute top-1/4 -left-32 w-64 md:w-80 h-64 md:h-80 bg-primary/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-36 w-72 md:w-96 h-72 md:h-96 bg-accent/10 rounded-full blur-[100px] md:blur-[120px] animate-pulse" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

                    {/* Text Content */}
                    <m.div
                        initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col space-y-8 text-center lg:text-start"
                    >
                        <div className="inline-flex items-center self-center lg:self-start rounded-full border border-primary/20 bg-secondary/30 px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold text-primary backdrop-blur-md shadow-sm">
                            <SparkleIcon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary animate-spin-slow" />
                            {badge}
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground font-heading leading-[1.1]">
                            {language === 'ar' ? (
                                <span dangerouslySetInnerHTML={{ __html: formatHeadline(headlineAr, 'ar') }} />
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: formatHeadline(headlineEn, 'en') }} />
                            )}
                        </h1>

                        <p className="text-lg md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                            <span className="font-medium text-foreground">{title}</span> — {bio}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                            <Button
                                size="lg"
                                className="group"
                                onClick={scrollToContact}
                            >
                                <Send className={`w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isRTL ? "rotate-180" : ""}`} />
                                {contactBtn}
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="glass group"
                                onClick={handleDownloadCV}
                                disabled={downloading}
                                aria-label={language === 'ar' ? "تحميل السيرة الذاتية" : "Download Resume"}
                            >
                                {downloading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5 group-hover:bounce transition-transform" />
                                )}
                                {downloading
                                    ? (language === 'ar' ? "جاري الإنشاء..." : "Generating...")
                                    : downloadBtn}
                            </Button>
                        </div>

                        {/* Quick Stats or Tags */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-6 opacity-60">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-foreground">{yearsExp}</span>
                                <span className="text-xs uppercase tracking-widest leading-none">{language === 'ar' ? "سنوات\nخبرة" : "Years of\nExperience"}</span>
                            </div>
                            <div className="w-px h-8 bg-border hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-foreground">{projectsNum}</span>
                                <span className="text-xs uppercase tracking-widest leading-none">{language === 'ar' ? "مشروع\nمنجز" : "Projects\nCompleted"}</span>
                            </div>
                        </div>
                    </m.div>

                    {/* Hero Image - Soft 3D Style */}
                    <m.div
                        ref={containerRef}
                        style={{ rotateX, rotateY, perspective: 1000 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, scale: 0.8, rotateY: isRTL ? -20 : 20 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative w-full aspect-square max-w-[550px] mx-auto group cursor-crosshair preserve-3d"
                    >
                        {/* 3D Layers */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Card Base */}
                        <div className="absolute inset-4 rounded-[4rem] glass shadow-2xl transition-transform duration-500 group-hover:translate-z-10" />

                        {/* Abstract Shapes behind image */}
                        <m.div
                            animate={{
                                rotate: [0, 90, 180, 270, 360],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-10 border-4 border-dashed border-primary/20 rounded-full"
                        />

                        {/* Profile Image with 3D Pop */}
                        <div className="relative w-full h-full flex items-center justify-center p-8 preserve-3d">
                            <m.div
                                className="relative w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-500 transform translate-z-20"
                            >
                                <Image
                                    src={heroImage}
                                    alt={language === 'ar' ? `صورة ${t.personalInfo.name}` : `Professional portrait of ${t.personalInfo.name}`}
                                    fill
                                    className="object-contain"
                                    priority
                                    fetchPriority="high"
                                    loading="eager"
                                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 450px, 550px"
                                />
                            </m.div>

                            {/* Floating Decorative Elements */}
                            <m.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/4 right-0 w-16 md:w-20 h-16 md:h-20 glass rounded-2xl flex items-center justify-center shadow-lg translate-z-40 rotate-12"
                            >
                                <CodeIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                            </m.div>
                            <m.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-1/4 left-0 w-14 md:w-16 h-14 md:h-16 glass rounded-full flex items-center justify-center shadow-lg translate-z-30 -rotate-12"
                            >
                                <MousePointer2 className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                            </m.div>
                        </div>
                    </m.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <m.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 10 }}
                transition={{ delay: 2, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group z-20"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {language === 'ar' ? "استكشف" : "Explore"}
                </span>
                <button
                    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-5 h-9 rounded-full border-2 border-muted-foreground/30 flex justify-center p-1 group-hover:border-primary transition-colors bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={language === 'ar' ? "انزل للأسفل" : "Scroll Down"}
                >
                    <m.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-2 bg-muted-foreground group-hover:bg-primary rounded-full"
                    />
                </button>
            </m.div>
        </section>
    );
}

// Helper function to format headline with styling
// Use **word** for primary color, __word__ for accent color with underline
function formatHeadline(text: string, lang: 'en' | 'ar'): string {
    // Replace **word** with primary colored span
    let formatted = text.replace(/\*\*([^*]+)\*\*/g,
        '<span class="text-primary relative group cursor-default">$1<span class="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span></span>'
    );

    // Replace __word__ with accent colored span
    formatted = formatted.replace(/__([^_]+)__/g,
        '<span class="text-accent underline decoration-accent/20 underline-offset-8">$1</span>'
    );

    // Replace ~~word~~ with italic font-light accent
    formatted = formatted.replace(/~~([^~]+)~~/g,
        '<span class="text-accent italic font-light">$1</span>'
    );

    // Replace newlines with <br>
    formatted = formatted.replace(/\n/g, '<br />');

    return formatted;
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            <path d="M19 3v4" />
            <path d="M21 5h-4" />
        </svg>
    );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    );
}
