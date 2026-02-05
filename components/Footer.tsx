"use client";

import { Heart } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { portfolioData } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
    const { language, direction } = useLanguage();
    const t = portfolioData[language];
    const currentYear = new Date().getFullYear();
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;

    // Fetch dynamic settings from Convex
    const storedSiteName = useQuery(api.messages.getSetting, { key: "site_name" });
    const storedTagline = useQuery(api.messages.getSetting, { key: "site_tagline" });

    // Use stored values or fallbacks
    const siteName = hasConvex && storedSiteName !== undefined ? storedSiteName : t.personalInfo.name.split(' ')[0];
    const tagline = hasConvex && storedTagline !== undefined ? storedTagline : t.personalInfo.title;
    const displaySiteName = siteName || t.personalInfo.name.split(' ')[0];

    return (
        <footer className="relative bg-background border-t border-border/30 overflow-hidden" dir={direction}>
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-accent/5 to-transparent" />
            </div>

            <div className="container px-4 md:px-6 py-16 md:py-24 relative z-10">
                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold font-heading text-foreground">
                                {displaySiteName}
                            </h3>
                            <p className="text-base text-muted-foreground">
                                {tagline}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                            {language === 'ar' ? 'متخصص في بناء تطبيقات ويب حديثة وقابلة للتطوير.' : 'Building modern and scalable web applications.'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-base font-semibold text-foreground uppercase tracking-widest">
                            {language === 'ar' ? 'روابط' : 'Links'}
                        </h4>
                        <ul className="flex flex-col gap-3.5">
                            <li><a href="/#home" className="text-base text-muted-foreground hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
                            <li><a href="/#about" className="text-base text-muted-foreground hover:text-primary transition-colors">{language === 'ar' ? 'عني' : 'About'}</a></li>
                            <li><a href="/#portfolio" className="text-base text-muted-foreground hover:text-primary transition-colors">{language === 'ar' ? 'أعمالي' : 'Portfolio'}</a></li>
                            <li><a href="/#contact" className="text-base text-muted-foreground hover:text-primary transition-colors">{language === 'ar' ? 'تواصل' : 'Contact'}</a></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                        <span>© {currentYear}</span>
                        <span className="font-semibold">{displaySiteName}</span>
                        <span>•</span>
                        <span>{language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
