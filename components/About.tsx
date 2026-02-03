"use client";

import { m } from "framer-motion";
import { Briefcase, Code, Database, Layout, Server, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { portfolioData } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";

// Icon Mapping for common tech
function SkillIcon({ name, className }: { name: string, className?: string }) {
    const iconProps = { className: className || "w-4 h-4", strokeWidth: 2.5 };
    const n = name.toLowerCase();

    // Frontend
    if (n.includes("html")) return <Code {...iconProps} className={`${iconProps.className} text-orange-500`} />;
    if (n.includes("css")) return <Layout {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    if (n.includes("js") || n.includes("javascript")) return <Sparkles {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    if (n.includes("typescript") || n.includes("ts")) return <Code {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    if (n.includes("react")) return <div className="animate-spin-slow"><Sparkles {...iconProps} className={`${iconProps.className} text-cyan-400`} /></div>;
    if (n.includes("tailwind")) return <Layout {...iconProps} className={`${iconProps.className} text-sky-400`} />;
    if (n.includes("bootstrap")) return <Layout {...iconProps} className={`${iconProps.className} text-purple-600`} />;
    if (n.includes("jquery")) return <Code {...iconProps} className={`${iconProps.className} text-blue-700`} />;

    // Backend
    if (n.includes("php")) return <Server {...iconProps} className={`${iconProps.className} text-indigo-400`} />;
    if (n.includes("laravel")) return <Server {...iconProps} className={`${iconProps.className} text-red-500`} />;
    if (n.includes("python")) return <Database {...iconProps} className={`${iconProps.className} text-green-600`} />;
    if (n.includes("node")) return <Server {...iconProps} className={`${iconProps.className} text-green-500`} />;
    if (n.includes("sql") || n.includes("db") || n.includes("database")) return <Database {...iconProps} className={`${iconProps.className} text-blue-400`} />;

    return <Code {...iconProps} />;
}

function SkillBadge({ name, color }: { name: string, color: "primary" | "accent" }) {
    return (
        <m.div
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 cursor-default shadow-sm hover:shadow-md
                ${color === 'primary'
                    ? 'bg-primary/5 border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'
                    : 'bg-accent/5 border-accent/20 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent'
                }`}
        >
            <SkillIcon name={name} className="w-4 h-4" />
            <span className="font-semibold text-sm tracking-tight">{name}</span>
        </m.div>
    );
}

export function About() {
    const { language, direction } = useLanguage();
    const t = portfolioData[language];
    const isRTL = direction === "rtl";

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden" dir={direction}>
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-secondary/10 -skew-y-6 -z-10" aria-hidden="true" />

            <div className="container px-4 md:px-6">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading">
                        {t.about.title}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
                        {t.about.subtitle}
                    </p>
                </m.div>

                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Experience Timeline */}
                    <div className="lg:col-span-7">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            {t.about.experienceTitle}
                        </h3>

                        <div className={`relative ${isRTL ? 'border-r-2 mr-4 pr-10' : 'border-l-2 ml-4 pl-10'} border-primary/20 space-y-12`}>
                            {t.experience.map((job, index) => (
                                <m.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    {/* Dot */}
                                    <div className={`absolute ${isRTL ? '-right-[49px]' : '-left-[49px]'} top-2 w-5 h-5 rounded-full bg-background border-4 border-primary transition-transform group-hover:scale-125`} />

                                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-secondary/10">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                                <h4 className="font-bold text-xl text-foreground">{job.role}</h4>
                                                <Badge variant="outline" className="w-fit mt-2 sm:mt-0 border-primary text-primary">
                                                    {job.period}
                                                </Badge>
                                            </div>

                                            <p className="text-lg font-medium text-accent mb-3 flex items-center gap-2">
                                                {job.company}
                                                {job.current && <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                                            </p>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {job.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </m.div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="lg:col-span-5">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            {t.about.skillsTitle}
                        </h3>

                        <m.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Frontend Skills */}
                            <Card className="border-border/50 shadow-xl overflow-hidden bg-background/50 backdrop-blur-sm">
                                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />
                                <CardContent className="p-8">
                                    <h4 className="font-bold text-xl mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Layout className="w-5 h-5" />
                                        </div>
                                        {t.about.frontend}
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {t.skills.frontend.map((skill) => (
                                            <SkillBadge key={skill.name} name={skill.name} color="primary" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Backend Skills */}
                            <Card className="border-border/50 shadow-xl overflow-hidden bg-background/50 backdrop-blur-sm">
                                <div className="h-1.5 w-full bg-gradient-to-r from-accent via-primary to-accent animate-gradient-x" />
                                <CardContent className="p-8">
                                    <h4 className="font-bold text-xl mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                            <Server className="w-5 h-5" />
                                        </div>
                                        {t.about.backend}
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {t.skills.backend.map((skill) => (
                                            <SkillBadge key={skill.name} name={skill.name} color="accent" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                        </m.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
