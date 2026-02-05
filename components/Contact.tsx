"use client";

import * as React from "react";
import { m, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, Github, Linkedin, Facebook, Check, ArrowUpRight, Phone } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { portfolioData, socialLinks as defaultSocialLinks } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

// Type alias for translation data
type TranslationData = typeof portfolioData.en;

// Component that safely uses Convex hook
function ConvexContactForm({ isRTL, t, onSuccess }: { isRTL: boolean, t: TranslationData, onSuccess: () => void }) {
    const sendMessage = useMutation(api.messages.send);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            await sendMessage({
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                message: formData.get("message") as string,
            });
            onSuccess();
        } catch {
            // Error handled silently - form submission failed
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormLayout
            isRTL={isRTL}
            t={t}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}

// Component for local submission (fallback)
function LocalContactForm({ isRTL, t, onSuccess }: { isRTL: boolean, t: TranslationData, onSuccess: () => void }) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onSuccess();
    };

    return (
        <FormLayout
            isRTL={isRTL}
            t={t}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}

// Fixed Shared Form Layout to actually include the form elements
function FormLayout({ isRTL, t, onSubmit, isSubmitting }: { isRTL: boolean, t: TranslationData, onSubmit: React.FormEventHandler<HTMLFormElement>, isSubmitting: boolean }) {
    return (
        <Card className="border-none bg-background/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
            <CardContent className="p-6 md:p-12">
                <form onSubmit={onSubmit} className="space-y-6 md:space-y-8">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3 group">
                            <label htmlFor="name" className="text-sm font-bold ml-1 transition-colors group-focus-within:text-primary">{t.contact.form.name}</label>
                            <Input
                                id="name"
                                name="name"
                                placeholder={t.contact.form.name}
                                required
                                className="bg-background/50 border-input focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all h-14 rounded-2xl text-lg font-medium px-6 placeholder:font-light"
                            />
                        </div>
                        <div className="space-y-3 group">
                            <label htmlFor="email" className="text-sm font-bold ml-1 transition-colors group-focus-within:text-primary">{t.contact.form.email}</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t.contact.form.email}
                                required
                                className="bg-background/50 border-input focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all h-14 rounded-2xl text-lg font-medium px-6 placeholder:font-light"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 group">
                        <label htmlFor="message" className="text-sm font-bold ml-1 transition-colors group-focus-within:text-primary">{t.contact.form.message}</label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder={t.contact.form.message}
                            required
                            className="min-h-[180px] bg-background/50 border-input focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-[1.5rem] text-lg font-medium px-6 py-4 resize-none placeholder:font-light"
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full text-xl group"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                {t.contact.form.sending}
                            </div>
                        ) : (
                            <span className="flex items-center gap-3">
                                {t.contact.form.send}
                                <Send className={cn("w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1", isRTL && "rotate-180")} />
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export function Contact() {
    const [isSuccess, setIsSuccess] = React.useState(false);
    const { language, direction } = useLanguage();
    const t = portfolioData[language];
    const isRTL = direction === "rtl";
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;

    // Always call useQuery (React hooks rule)
    const storedEmail = useQuery(api.messages.getSetting, { key: "contact_email" });
    const storedPhones = useQuery(api.messages.getSetting, { key: "contact_phones" });
    const storedFacebook = useQuery(api.messages.getSetting, { key: "social_facebook" });
    const storedGithub = useQuery(api.messages.getSetting, { key: "social_github" });
    const storedLinkedin = useQuery(api.messages.getSetting, { key: "social_linkedin" });
    
    // Use stored values from Convex, fallback to portfolio data
    const contactEmail = (hasConvex && storedEmail !== undefined && storedEmail) ? storedEmail : t.personalInfo.email;
    
    // Parse phone numbers from JSON
    const phoneNumbers = React.useMemo(() => {
        if (hasConvex && storedPhones !== undefined && storedPhones) {
            try {
                const parsed = JSON.parse(storedPhones);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    }, [hasConvex, storedPhones]);
    
    // Build dynamic social links
    const socialLinks = React.useMemo(() => {
        const links: Array<{ name: string; url: string; icon: string }> = [];
        
        const facebookUrl = (hasConvex && storedFacebook !== undefined && storedFacebook) 
            ? storedFacebook 
            : defaultSocialLinks.find(l => l.icon === "facebook")?.url;
        if (facebookUrl) {
            links.push({ name: "Facebook", url: facebookUrl, icon: "facebook" });
        }
        
        const githubUrl = (hasConvex && storedGithub !== undefined && storedGithub) 
            ? storedGithub 
            : defaultSocialLinks.find(l => l.icon === "github")?.url;
        if (githubUrl) {
            links.push({ name: "GitHub", url: githubUrl, icon: "github" });
        }
        
        const linkedinUrl = (hasConvex && storedLinkedin !== undefined && storedLinkedin) 
            ? storedLinkedin 
            : defaultSocialLinks.find(l => l.icon === "linkedin")?.url;
        if (linkedinUrl) {
            links.push({ name: "LinkedIn", url: linkedinUrl, icon: "linkedin" });
        }
        
        // Always add email link
        links.push({ name: "Email", url: `mailto:${contactEmail}`, icon: "mail" });
        
        return links;
    }, [hasConvex, storedFacebook, storedGithub, storedLinkedin, contactEmail]);

    const handleSuccess = () => {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
    };

    return (
        <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden" dir={direction}>
            {/* Background Decorative Elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-primary/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

                        {/* Header & Info Side */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Section Header */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-5"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-full border border-primary/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    {language === 'ar' ? "تواصل معي" : "Get in Touch"}
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground font-heading leading-tight">
                                    {t.contact.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 === 1 ? "text-primary dark:text-primary" : ""}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h2>
                                <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
                                    {t.contact.subtitle}
                                </p>
                            </m.div>

                            {/* Contact Info Cards */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="space-y-3"
                            >
                                {/* Email */}
                                <a 
                                    href={`mailto:${contactEmail}`}
                                    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-card transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                                        <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                                    </div>
                                    <div className="relative flex-grow min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                                            {t.contact.form.email}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                                            {contactEmail}
                                        </p>
                                    </div>
                                    <ArrowUpRight className="relative w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                                </a>

                                {/* Phone Numbers */}
                                {phoneNumbers.length > 0 && phoneNumbers.map((phone: { id?: string; label: string; number: string }, index: number) => (
                                    <a 
                                        key={phone.id || index}
                                        href={`tel:${phone.number.replace(/\s/g, '')}`}
                                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-card transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                                            <Phone className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                                        </div>
                                        <div className="relative flex-grow min-w-0">
                                            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                                                {phone.label || (language === 'ar' ? 'الهاتف' : 'Phone')}
                                            </p>
                                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate" dir="ltr">
                                                {phone.number}
                                            </p>
                                        </div>
                                        <ArrowUpRight className="relative w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                                    </a>
                                ))}

                                {/* Location */}
                                <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden">
                                    <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="relative flex-grow min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                                            {language === 'ar' ? 'الموقع' : 'Location'}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {t.personalInfo.location}
                                        </p>
                                    </div>
                                </div>
                            </m.div>

                            {/* Social Links */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="pt-4"
                            >
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-3">
                                    <span className="flex-grow h-px bg-border" />
                                    {t.contact.followMe}
                                    <span className="flex-grow h-px bg-border" />
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    {socialLinks.map((link, index) => (
                                        <m.a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
                                            aria-label={language === 'ar' ? `تابعني على ${link.name}` : `Follow me on ${link.name}`}
                                        >
                                            {link.icon === "github" && <Github className="w-4 h-4" />}
                                            {link.icon === "linkedin" && <Linkedin className="w-4 h-4" />}
                                            {link.icon === "facebook" && <Facebook className="w-4 h-4" />}
                                            {link.icon === "mail" && <Mail className="w-4 h-4" />}
                                        </m.a>
                                    ))}
                                </div>
                            </m.div>
                        </div>

                        {/* Form Side */}
                        <div className="lg:col-span-3">
                            <m.div
                                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative"
                            >
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <m.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-background/80 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl border border-primary/20 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]"
                                        >
                                            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 md:mb-8 animate-bounce-slow">
                                                <Check className="w-10 h-10 md:w-12 md:h-12" />
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-black mb-3 md:mb-4">{t.contact.form.sent}</h3>
                                            <p className="text-base md:text-xl text-muted-foreground max-w-sm">
                                                {language === 'ar' ? 'شكراً لتواصلك معي! سأقوم بالرد عليك في أقرب وقت ممكن.' : 'Thanks for reaching out! I will get back to you as soon as possible.'}
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="mt-8 md:mt-10 h-12 md:h-14 px-6 md:px-8 rounded-2xl border-2 font-bold"
                                                onClick={() => setIsSuccess(false)}
                                            >
                                                {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send another message'}
                                            </Button>
                                        </m.div>
                                    ) : (
                                        <div key="form">
                                            {hasConvex ? (
                                                <ConvexContactForm isRTL={isRTL} t={t} onSuccess={handleSuccess} />
                                            ) : (
                                                <LocalContactForm isRTL={isRTL} t={t} onSuccess={handleSuccess} />
                                            )}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </m.div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
