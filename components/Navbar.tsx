"use client";

import * as React from "react";
import { m, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Globe, Zap } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { portfolioData } from "@/data/portfolio-data";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/components/LanguageProvider";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { scrollY } = useScroll();
    const [activeSection, setActiveSection] = React.useState("home");
    const { language, setLanguage, direction } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();

    const t = portfolioData[language];
    const navLinks = t.navLinks;
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;

    // Fetch dynamic settings from Convex with real-time reactivity
    const storedSiteName = useQuery(api.messages.getSetting, { key: "site_name" });
    const storedTagline = useQuery(api.messages.getSetting, { key: "site_tagline" });
    const storedLogo = useQuery(api.messages.getSetting, { key: "site_logo" });

    // Use stored values or fallbacks
    const siteName = hasConvex && storedSiteName !== undefined ? storedSiteName : t.personalInfo.name.split(' ')[0];
    const tagline = hasConvex && storedTagline !== undefined ? storedTagline : t.personalInfo.title;
    const logo = hasConvex && storedLogo !== undefined ? storedLogo : null;
    const displaySiteName = siteName || t.personalInfo.name.split(' ')[0];

    useMotionValueEvent(scrollY, "change", (latest) => {
        const isScrolledNow = latest > 20;
        if (isScrolledNow !== isScrolled) {
            setIsScrolled(isScrolledNow);
        }
    });

    const isHome = pathname === "/";

    // Active section observer - deferred setup to reduce TBT
    React.useEffect(() => {
        if (!isHome) return;

        let observer: IntersectionObserver | null = null;

        // Defer observer setup to when browser is idle
        const setupObserver = () => {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(entry.target.id);
                        }
                    });
                },
                { threshold: 0.3, rootMargin: "-50% 0px -50% 0px" }
            );

            navLinks.forEach((link) => {
                if (link.href.startsWith("/")) return;
                const element = document.getElementById(link.href.replace("#", ""));
                if (element && observer) {
                    observer.observe(element);
                }
            });
        };

        // Use requestIdleCallback if available, otherwise use setTimeout
        let handle: ReturnType<typeof setTimeout> | number;
        if ('requestIdleCallback' in window) {
            handle = (window as Window & typeof globalThis & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(setupObserver, { timeout: 300 });
        } else {
            handle = setTimeout(setupObserver, 100);
        }

        return () => {
            if ('requestIdleCallback' in window && typeof handle === 'number') {
                (window as Window & typeof globalThis & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
            } else {
                clearTimeout(handle as ReturnType<typeof setTimeout>);
            }
            observer?.disconnect();
        };
    }, [navLinks, isHome]);

    const scrollTo = (href: string) => {
        const id = href.replace("#", "");

        // Handle dashboard link
        if (href === "/dashboard" || href.startsWith("/dashboard")) {
            router.push("/dashboard");
            return;
        }

        if (isHome) {
            setActiveSection(id);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            router.push(`/${href.startsWith('#') ? href : '#' + id}`);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <m.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled && "bg-background/80 backdrop-blur-md shadow-sm border-border/50"
            )}
            dir={direction}
        >
            <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo / Name */}
                <button
                    onClick={() => scrollTo("#home")}
                    className="group cursor-pointer flex items-center gap-3 bg-transparent border-none p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                    aria-label={language === 'ar' ? "العودة للرئيسية" : "Back to Home"}
                >
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl group-hover:rotate-12 transition-transform duration-300" />
                        {logo ? (
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg">
                                <img
                                    src={logo}
                                    alt={displaySiteName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20 group-hover:-rotate-12 transition-transform duration-300">
                                {displaySiteName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="tracking-tighter font-heading font-black text-xl leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-500">
                            {displaySiteName}
                        </span>
                        {tagline && (
                            <span className="text-xs text-muted-foreground/80 font-medium leading-tight">
                                {tagline}
                            </span>
                        )}
                    </div>
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isDashboard = link.href.startsWith("/") && !link.href.startsWith("#");
                        const isActive = isDashboard
                            ? pathname === link.href || pathname.startsWith(link.href + "/")
                            : activeSection === link.href.replace("#", "");
                        return (
                            <Button
                                key={link.name}
                                variant="ghost"
                                onClick={() => scrollTo(link.href)}
                                className={cn(
                                    "relative h-9 px-4 text-sm font-medium transition-colors hover:text-primary",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                                {isActive && !isDashboard && (
                                    <m.div
                                        layoutId="navbar-active"
                                        className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                                        transition={{ type: "spring", duration: 0.5 }}
                                    />
                                )}
                            </Button>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        className="rounded-full w-9 h-9"
                    >
                        <Globe className="w-[1.2rem] h-[1.2rem] text-primary" />
                        <span className="sr-only">{language === 'en' ? "Change to Arabic" : "تغيير للإنجليزية"}</span>
                    </Button>

                    <ThemeToggle />

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" aria-label={language === 'ar' ? "القائمة" : "Menu"}>
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={language === "ar" ? "left" : "right"} className="w-[80%] sm:w-[350px]">
                            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                            <div className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => {
                                    const isDashboard = link.href.startsWith("/") && !link.href.startsWith("#");
                                    return (
                                        <Button
                                            key={link.name}
                                            variant={isDashboard ? "outline" : "ghost"}
                                            size="lg"
                                            className={cn(
                                                "justify-start text-lg",
                                                isDashboard && "border-primary"
                                            )}
                                            onClick={() => scrollTo(link.href)}
                                        >
                                            {link.name}
                                        </Button>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </m.header>
    );
}
