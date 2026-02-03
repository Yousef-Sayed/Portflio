"use client";

import * as React from "react";
import { m } from "framer-motion";
import { ArrowLeft, Globe, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { portfolioData } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProjectContent({ slug }: { slug: string }) {
    const { language, direction } = useLanguage();
    const t = portfolioData[language];
    const isRTL = direction === "rtl";

    const project = t.projects.find(p => p.slug === slug);

    if (!project) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <h1 className="text-4xl font-bold">Project Not Found</h1>
                <Button asChild>
                    <Link href="/">{language === 'ar' ? "العودة للرئيسية" : "Back to Home"}</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 min-h-screen" dir={direction}>
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                {/* Back Button */}
                <m.div
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Button variant="outline" asChild className="group gap-2 rounded-xl px-4 transition-all duration-300 ease-in-out hover:shadow-md">
                        <Link href="/#portfolio">
                            <ArrowLeft className={cn("w-4 h-4 transition-transform duration-300 ease-in-out group-hover:-translate-x-1", isRTL && "rotate-180 group-hover:translate-x-1")} />
                            {language === 'ar' ? "العودة للمعرض" : "Back to Portfolio"}
                        </Link>
                    </Button>
                </m.div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Visual Section */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group"
                    >
                        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl border border-border/50 bg-secondary/10 group-hover:shadow-primary/5 transition-all duration-700">
                            <Image
                                src={project.image}
                                alt={language === 'ar' ? `لقطة شاشة لمشروع ${project.title}` : `Screenshot of ${project.title} project`}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        </div>

                        {/* Interactive floating badges if any or just decoration */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />
                    </m.div>

                    {/* Info Section */}
                    <div className="space-y-10">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="px-3 py-1 font-bold">
                                    {project.platform}
                                </Badge>
                                {project.featured && (
                                    <Badge variant="default" className="px-3 py-1">
                                        {language === 'ar' ? "مميز" : "Featured"}
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter font-heading leading-[1.1]">
                                {project.title}
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                                {project.description}
                            </p>
                        </m.div>

                        {/* Tech Stack */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-6 pt-4 border-t border-border/50"
                        >
                            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                                <span className="w-10 h-[1px] bg-primary/30" />
                                {language === 'ar' ? "التقنيات المستخدمة" : "Technologies Used"}
                            </h2>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {project.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-1">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </m.div>

                        {/* Links */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col gap-3 sm:gap-4 pt-6"
                        >
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {project.liveUrl && (
                                    <Button size="lg" variant="gradient" className="rounded-2xl gap-3 h-14 px-6 sm:px-8 text-base sm:text-lg font-bold group overflow-hidden relative flex-1 sm:flex-none shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out" asChild>
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                            <Globe className="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
                                            <span className="hidden sm:inline">{language === 'ar' ? "زيارة الموقع" : "Visit Website"}</span>
                                            <span className="sm:hidden">{language === 'ar' ? "الموقع" : "Website"}</span>
                                        </a>
                                    </Button>
                                )}
                                {project.playStoreUrl && (
                                    <Button variant="outline" size="lg" className="rounded-2xl gap-3 h-14 px-6 sm:px-8 text-base sm:text-lg font-bold border-2 transition-all duration-300 ease-in-out group flex-1 sm:flex-none hover:shadow-lg" asChild>
                                        <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer">
                                            <PlayStoreIcon className="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                                            <span className="hidden sm:inline">{language === 'ar' ? "جوجل بلاي" : "Play Store"}</span>
                                            <span className="sm:hidden">{language === 'ar' ? "بلاي" : "Store"}</span>
                                        </a>
                                    </Button>
                                )}
                            </div>
                            {project.githubUrl && (
                                <Button variant="ghost" size="lg" className="rounded-2xl gap-3 h-14 px-6 sm:px-8 text-base sm:text-lg font-bold border-2 border-primary/30 group transition-all duration-300 ease-in-out hover:bg-primary/10 hover:border-primary/80 hover:shadow-md active:shadow-sm" asChild>
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:-rotate-12" />
                                        <span className="hidden sm:inline">{language === 'ar' ? "كود المشروع" : "Project Code"}</span>
                                        <span className="sm:hidden">{language === 'ar' ? "كود" : "Code"}</span>
                                    </a>
                                </Button>
                            )}
                        </m.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayStoreIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.27C19.2,16.61 19.34,17.34 18.96,17.84C18.17,18.89 16.14,21.57 15.1,21.96C14.71,22.11 14.1,21.71 13.69,21.3L13.69,21.29L16.81,15.12M13.69,12L16.81,8.88L13.69,12M16.81,8.88L13.69,2.71C14.1,2.3 14.71,1.9 15.1,2.05C16.14,2.44 18.17,5.12 18.96,6.17C19.34,6.67 19.2,7.4 18.66,7.74L16.81,8.88M14.4,12L21.3,15.75L14.4,12M14.4,12L21.3,8.25L14.4,12Z" />
        </svg>
    );
}
