"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Folder, Smartphone, Globe } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { portfolioData } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";

export function Portfolio() {
    const { language, direction } = useLanguage();
    const t = portfolioData[language];
    const isRTL = direction === "rtl";

    const projects = t.projects;

    return (
        <section id="portfolio" className="py-20 md:py-32 bg-secondary/5 relative" dir={direction}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-tr-[100px] -z-10" />

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
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={project.id}
                                className="group"
                            >
                                <div className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 group-hover:-translate-y-2 h-full flex flex-col relative">
                                    {/* Platform Badge */}
                                    {project.platform && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <Badge className="bg-background/80 hover:bg-background/90 backdrop-blur-md text-foreground border-border/50 text-[10px] py-0 px-2 flex items-center gap-1 shadow-sm">
                                                {project.platform.includes('Mobile') ? <Smartphone className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                                {project.platform}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Image Container */}
                                    <div className="relative aspect-[16/9] overflow-hidden bg-secondary/10">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <div className="flex flex-wrap gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                {project.liveUrl && (
                                                    <Button size="sm" className="rounded-xl shadow-lg bg-white text-black hover:bg-white/90" asChild>
                                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} /> {language === 'ar' ? "الموقع" : "Website"}
                                                        </a>
                                                    </Button>
                                                )}
                                                {project.playStoreUrl && (
                                                    <Button size="sm" className="rounded-xl shadow-lg bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                                                        <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer">
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
                                            <div>
                                                <h3 className="font-bold text-xl group-hover:text-primary transition-colors font-heading mb-1">
                                                    {project.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {project.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow italic">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
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

