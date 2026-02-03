"use client";

import { Laptop } from "lucide-react";

import { portfolioData } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
    const { language, direction } = useLanguage();
    const t = portfolioData[language];

    return (
        <footer className="py-8 bg-background border-t border-border/40" dir={direction}>
            <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="w-full text-sm font-medium text-foreground/80 flex items-center justify-center gap-2 rounded-md hover:bg-secondary/10 px-2 py-1 transition-colors">
                    <Laptop className="w-4 h-4" />
                    {t.contact.footerCredit}
                </p>
            </div>
        </footer>
    );
}
