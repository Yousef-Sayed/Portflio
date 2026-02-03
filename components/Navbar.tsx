"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { portfolioData } from "@/data/portfolio-data";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/components/LanguageProvider";

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { scrollY } = useScroll();
    const [activeSection, setActiveSection] = React.useState("home");
    const { language, setLanguage, direction } = useLanguage();

    const t = portfolioData[language];
    const navLinks = t.navLinks;

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20);
    });

    // Active section observer
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        navLinks.forEach((link) => {
            const element = document.getElementById(link.href.replace("#", ""));
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [navLinks]);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <motion.header
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
                <div
                    onClick={() => scrollTo("home")}
                    className="group cursor-pointer flex items-center gap-3"
                >
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl group-hover:rotate-12 transition-transform duration-300" />
                        <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20 group-hover:-rotate-12 transition-transform duration-300">
                            {t.personalInfo.name.charAt(0)}
                        </div>
                    </div>
                    <span className="hidden sm:inline-block tracking-tighter font-heading font-black text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-500">
                        {t.personalInfo.name.split(' ')[0]}
                    </span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.href.replace("#", "");
                        return (
                            <Button
                                key={link.name}
                                variant="ghost"
                                onClick={() => scrollTo(link.href.replace("#", ""))}
                                className={cn(
                                    "relative h-9 px-4 text-sm font-medium transition-colors hover:text-primary",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
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
                        <span className="sr-only">Toggle Language</span>
                    </Button>

                    <ThemeToggle />

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={language === "ar" ? "left" : "right"} className="w-[80%] sm:w-[350px]">
                            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                            <div className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Button
                                        key={link.name}
                                        variant="ghost"
                                        size="lg"
                                        className="justify-start text-lg"
                                        onClick={() => scrollTo(link.href.replace("#", ""))}
                                    >
                                        {link.name}
                                    </Button>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
}
