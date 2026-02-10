"use client";

import * as React from "react";
import { m, AnimatePresence } from "framer-motion";
import { ExternalLink, Smartphone, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { portfolioData, Project } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";

export function Portfolio() {
    const { language, direction } = useLanguage();
    const t = portfolioData[language];
    const isRTL = direction === "rtl";
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;

    // Fetch projects from Convex
    const convexProjects = useQuery(api.projects.getActive);

    // Map Convex projects to the expected format with language support
    const dynamicProjects: Project[] = React.useMemo(() => {
        if (!convexProjects || convexProjects.length === 0) return [];

        return convexProjects.map(p => ({
            id: p._id,
            slug: p.slug,
            title: language === 'ar' && p.titleAr ? p.titleAr : p.title,
            description: language === 'ar' && p.descriptionAr ? p.descriptionAr : p.description,
            image: p.image,
            tags: p.tags,
            platform: language === 'ar' && p.platformAr ? p.platformAr : p.platform,
            liveUrl: p.liveUrl,
            playStoreUrl: p.playStoreUrl,
            githubUrl: p.githubUrl,
            featured: p.featured,
        }));
    }, [convexProjects, language]);

    // Use Convex projects if available, otherwise fall back to static data
    const projects = hasConvex && dynamicProjects.length > 0 ? dynamicProjects : t.projects;

    return (
        <section id="portfolio" className="py-24 md:py-32 bg-secondary/5 relative" dir={direction}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-[100px] -z-10" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-tr-[100px] -z-10" aria-hidden="true" />

            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center mb-10 md:mb-16 space-y-4 md:space-y-6 text-center">
                    <Badge variant="outline" className="border-primary/30 text-primary px-4 py-1 text-xs md:text-sm uppercase tracking-widest">
                        {t.portfolio.title}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-heading">
                        {language === 'ar' ? "معرض أعمالي" : "Selected Works"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl text-base md:text-lg px-4 md:px-0">
                        {t.portfolio.subtitle}
                    </p>
                </div>

                <div className="grid gap-6 md:gap-10 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12 px-2 md:px-0">
                    <AnimatePresence mode="popLayout">
                        {projects.map((project, index) => (
                            <m.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
                                key={project.id}
                                className="group"
                            >
                                <div className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 group-hover:-translate-y-2 h-full flex flex-col relative">
                                    {/* Platform Badge */}
                                    {project.platform && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <Badge variant="secondary" className="bg-background/80 hover:bg-background/90 backdrop-blur-md text-foreground border-border/50 text-[10px] py-0 px-2 flex items-center gap-1 shadow-sm transition-all group-hover:scale-105">
                                                {project.platform.includes('Mobile') ? <Smartphone className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                                {project.platform}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Image Container */}
                                    <div className="relative aspect-[16/9] overflow-hidden bg-secondary/10 group/img">
                                        <Link href={`/projects/${project.slug}`} className="block w-full h-full relative cursor-pointer z-10">
                                            <Image
                                                src={project.image}
                                                alt={language === 'ar' ? `لقطة شاشة لمشروع ${project.title}` : `Screenshot of ${project.title} project`}
                                                fill
                                                loading="lazy"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 30vw"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/0 transition-colors" />
                                        </Link>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex flex-col justify-end p-6 z-20">
                                            <div className="flex flex-wrap gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <Button size="sm" variant="secondary" className="rounded-xl shadow-lg font-bold" asChild>
                                                    <Link href={`/projects/${project.slug}`}>
                                                        {language === 'ar' ? "تفاصيل المشروع" : "Project Details"}
                                                    </Link>
                                                </Button>
                                                {project.liveUrl && (
                                                    <Button size="sm" variant="default" className="rounded-xl shadow-lg" asChild>
                                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={language === 'ar' ? `عرض موقع ${project.title}` : `View ${project.title} website`}>
                                                            <ExternalLink className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} /> {language === 'ar' ? "الموقع" : "Website"}
                                                        </a>
                                                    </Button>
                                                )}
                                                {project.playStoreUrl && (
                                                    <Button size="sm" className="rounded-xl shadow-lg bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                                                        <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" aria-label={language === 'ar' ? `عرض ${project.title} على متجر جوجل` : `View ${project.title} on Play Store`}>
                                                            <PlayStoreIcon className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} /> {language === 'ar' ? "جوجل بلاي" : "Play Store"}
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-full">
                                                <Link href={`/projects/${project.slug}`} className="block group/title">
                                                    <h3 className="font-bold text-xl group-hover/title:text-primary transition-colors font-heading mb-1 inline-flex items-center gap-2">
                                                        {project.title}
                                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-opacity text-primary" />
                                                    </h3>
                                                </Link>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {project.tags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground border-border/50">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-base leading-relaxed mb-6 flex-grow line-clamp-4">
                                            {project.description}
                                        </p>

                                        {/* Mobile/Tablet Only Links (Hidden on Desktop) */}
                                        <div className="flex lg:hidden flex-wrap gap-2 mt-auto pt-4 border-t border-border/50">
                                            <Button size="sm" variant="secondary" className="rounded-xl flex-1 text-xs h-9 font-bold" asChild>
                                                <Link href={`/projects/${project.slug}`}>
                                                    {language === 'ar' ? "التفاصيل" : "Details"}
                                                </Link>
                                            </Button>
                                            {project.liveUrl && (
                                                <Button size="sm" variant="outline" className="rounded-xl flex-1 text-xs h-9 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={language === 'ar' ? `عرض موقع ${project.title}` : `View ${project.title} website`}>
                                                        <ExternalLink className={`w-3.5 h-3.5 ${isRTL ? "ml-1.5" : "mr-1.5"}`} /> {language === 'ar' ? "الموقع" : "Website"}
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

function PlayStoreIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.27C19.2,16.61 19.34,17.34 18.96,17.84C18.17,18.89 16.14,21.57 15.1,21.96C14.71,22.11 14.1,21.71 13.69,21.3L13.69,21.29L16.81,15.12M13.69,12L16.81,8.88L13.69,12M16.81,8.88L13.69,2.71C14.1,2.3 14.71,1.9 15.1,2.05C16.14,2.44 18.17,5.12 18.96,6.17C19.34,6.67 19.2,7.4 18.66,7.74L16.81,8.88M14.4,12L21.3,15.75L14.4,12M14.4,12L21.3,8.25L14.4,12Z" />
        </svg>
    );
}

