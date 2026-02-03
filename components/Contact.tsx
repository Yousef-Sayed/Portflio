"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, Github, Linkedin, Facebook, Check, Phone, ArrowUpRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { portfolioData, socialLinks } from "@/data/portfolio-data";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

// Component that safely uses Convex hook
function ConvexContactForm({ isRTL, t, onSuccess }: { isRTL: boolean, t: any, onSuccess: () => void }) {
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
        } catch (error) {
            console.error("Convex error:", error);
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
function LocalContactForm({ isRTL, t, onSuccess }: { isRTL: boolean, t: any, onSuccess: () => void }) {
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
function FormLayout({ isRTL, t, onSubmit, isSubmitting }: { isRTL: boolean, t: any, onSubmit: any, isSubmitting: boolean }) {
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

    const handleSuccess = () => {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
    };

    return (
        <section id="contact" className="py-24 md:py-32 bg-background relative overflow-hidden" dir={direction}>
            {/* Background Decorative Element */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-primary/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

                        {/* Header & Info Side */}
                        <div className="lg:col-span-2 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-primary/10 text-primary text-[10px] md:text-sm font-bold tracking-widest uppercase rounded-lg">
                                    {language === 'ar' ? "تواصل معي" : "Get in Touch"}
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-foreground font-heading leading-tight">
                                    {t.contact.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 === 1 ? "text-primary dark:text-primary" : ""}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h2>
                                <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-light">
                                    {t.contact.subtitle}
                                </p>
                            </motion.div>

                            <div className="space-y-6">
                                {[
                                    { icon: Mail, label: t.contact.form.email, value: t.personalInfo.email, link: `mailto:${t.personalInfo.email}`, color: "bg-blue-500/10 text-blue-500" },
                                    { icon: MapPin, label: language === 'ar' ? 'الموقع' : 'Location', value: t.personalInfo.location, link: null, color: "bg-red-500/10 text-red-500" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group p-5 md:p-6 rounded-3xl bg-secondary/10 border border-border/50 hover:bg-secondary/20 transition-all cursor-default"
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform", item.color)}>
                                                <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                                                {item.link ? (
                                                    <a href={item.link} className="text-sm md:text-xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2 break-all sm:break-normal">
                                                        {item.value}
                                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                    </a>
                                                ) : (
                                                    <p className="text-lg md:text-xl font-bold text-foreground break-words">{item.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="space-y-6 pt-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t.contact.followMe}</h4>
                                <div className="flex flex-wrap gap-4">
                                    {socialLinks.map((link, i) => (
                                        <motion.a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -5, scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-14 h-14 rounded-2xl bg-secondary/20 border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
                                        >
                                            {link.icon === "github" && <Github className="w-6 h-6" />}
                                            {link.icon === "linkedin" && <Linkedin className="w-6 h-6" />}
                                            {link.icon === "facebook" && <Facebook className="w-6 h-6" />}
                                            {link.icon === "mail" && <Mail className="w-6 h-6" />}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative"
                            >
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-background/80 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl border border-primary/20 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]"
                                        >
                                            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce-slow">
                                                <Check className="w-12 h-12" />
                                            </div>
                                            <h3 className="text-4xl font-black mb-4">{t.contact.form.sent}</h3>
                                            <p className="text-xl text-muted-foreground max-w-sm">
                                                {language === 'ar' ? 'شكراً لتواصلك معي! سأقوم بالرد عليك في أقرب وقت ممكن.' : 'Thanks for reaching out! I will get back to you as soon as possible.'}
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="mt-10 h-14 px-8 rounded-2xl border-2 font-bold"
                                                onClick={() => setIsSuccess(false)}
                                            >
                                                {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send another message'}
                                            </Button>
                                        </motion.div>
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
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
