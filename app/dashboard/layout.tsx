"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import {
    Menu,
    Search,
    MessageSquare,
    LayoutDashboard,
    Settings,
    Zap,
    Mail,
    Home,
    FileText,
    ImageIcon,
    FolderKanban,
    Sparkles,
    Briefcase,
    Image
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { language, direction, setLanguage } = useLanguage();
    const router = useRouter();
    const isRTL = direction === "rtl";
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const messages = useQuery(api.messages.getAll) || [];
    const projects = useQuery(api.projects.getAll) || [];
    const skills = useQuery(api.skills.getAll) || [];
    const experience = useQuery(api.experience.getAll) || [];

    const t = {
        en: {
            searchPlaceholder: "Search everything...",
            noResults: "No results found.",
            pages: "Pages",
            settings: "Settings",
            actions: "Quick Actions",
            overview: "Overview",
            messages: "Messages",
            settingsPage: "Settings",
            branding: "Branding Settings",
            general: "General Settings",
            email: "Contact Email",
            logo: "Site Logo",
            siteName: "Site Name",
            backToSite: "Back to Site",
            recentMessages: "Recent Messages",
            searchMessages: "Search Messages",
            hero: "Hero Section",
            projects: "Projects",
            skills: "Skills",
            experience: "Experience",
            content: "Content",
            searchResults: "Search Results",
            inProjects: "in Projects",
            inSkills: "in Skills",
            inExperience: "in Experience",
            inMessages: "in Messages",
        },
        ar: {
            searchPlaceholder: "البحث في كل شيء...",
            noResults: "لا توجد نتائج.",
            pages: "الصفحات",
            settings: "الإعدادات",
            actions: "إجراءات سريعة",
            overview: "نظرة عامة",
            messages: "الرسائل",
            settingsPage: "الإعدادات",
            branding: "إعدادات العلامة التجارية",
            general: "الإعدادات العامة",
            email: "البريد الإلكتروني للتواصل",
            logo: "شعار الموقع",
            siteName: "اسم الموقع",
            backToSite: "العودة للموقع",
            recentMessages: "الرسائل الأخيرة",
            searchMessages: "البحث في الرسائل",
            hero: "قسم البطل",
            projects: "المشاريع",
            skills: "المهارات",
            experience: "الخبرات",
            content: "المحتوى",
            searchResults: "نتائج البحث",
            inProjects: "في المشاريع",
            inSkills: "في المهارات",
            inExperience: "في الخبرات",
            inMessages: "في الرسائل",
        },
    };

    const currentT = t[language as keyof typeof t];

    const pageItems = [
        { name: currentT.overview, href: "/dashboard", icon: LayoutDashboard, keywords: ["dashboard", "home", "overview", "لوحة التحكم", "الرئيسية", "نظرة عامة"] },
        { name: currentT.hero, href: "/dashboard/hero", icon: Image, keywords: ["hero", "banner", "header", "image", "البطل", "الصورة", "العنوان"] },
        { name: currentT.projects, href: "/dashboard/projects", icon: FolderKanban, keywords: ["projects", "portfolio", "work", "المشاريع", "الأعمال"] },
        { name: currentT.skills, href: "/dashboard/skills", icon: Sparkles, keywords: ["skills", "abilities", "المهارات", "القدرات"] },
        { name: currentT.experience, href: "/dashboard/experience", icon: Briefcase, keywords: ["experience", "work", "jobs", "الخبرات", "العمل"] },
        { name: currentT.messages, href: "/dashboard/messages", icon: MessageSquare, keywords: ["messages", "inbox", "contact", "الرسائل", "البريد", "التواصل"] },
        { name: currentT.settingsPage, href: "/dashboard/settings", icon: Settings, keywords: ["settings", "preferences", "config", "الإعدادات", "التفضيلات"] },
    ];

    const settingsItems = [
        { name: currentT.branding, href: "/dashboard/settings?tab=branding", icon: Zap, keywords: ["branding", "logo", "name", "العلامة التجارية", "الشعار"] },
        { name: currentT.general, href: "/dashboard/settings?tab=general", icon: Mail, keywords: ["general", "email", "contact", "عام", "البريد"] },
        { name: currentT.siteName, href: "/dashboard/settings?tab=branding", icon: FileText, keywords: ["site name", "title", "اسم الموقع", "العنوان"] },
        { name: currentT.logo, href: "/dashboard/settings?tab=branding", icon: ImageIcon, keywords: ["logo", "image", "icon", "الشعار", "الصورة"] },
        { name: currentT.email, href: "/dashboard/settings?tab=general", icon: Mail, keywords: ["email", "contact", "البريد", "التواصل"] },
    ];

    const contentItems = [
        { name: language === "en" ? "Add Project" : "إضافة مشروع", href: "/dashboard/projects", icon: FolderKanban, keywords: ["add project", "new project", "إضافة مشروع", "مشروع جديد"] },
        { name: language === "en" ? "Add Skill" : "إضافة مهارة", href: "/dashboard/skills", icon: Sparkles, keywords: ["add skill", "new skill", "إضافة مهارة", "مهارة جديدة"] },
        { name: language === "en" ? "Add Experience" : "إضافة خبرة", href: "/dashboard/experience", icon: Briefcase, keywords: ["add experience", "new experience", "إضافة خبرة", "خبرة جديدة"] },
        { name: language === "en" ? "Edit Hero Image" : "تعديل صورة البطل", href: "/dashboard/hero", icon: Image, keywords: ["hero image", "banner", "صورة البطل", "الشعار"] },
        { name: language === "en" ? "Upload CV" : "رفع السيرة الذاتية", href: "/dashboard/hero", icon: FileText, keywords: ["cv", "resume", "upload", "السيرة الذاتية", "رفع"] },
    ];

    const actionItems = [
        { name: currentT.backToSite, href: "/", icon: Home, keywords: ["home", "site", "back", "الرئيسية", "الموقع"] },
    ];

    const filteredMessages = React.useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        const query = searchQuery.toLowerCase();
        return messages.filter(msg => 
            msg.name.toLowerCase().includes(query) ||
            msg.email.toLowerCase().includes(query) ||
            msg.message.toLowerCase().includes(query)
        ).slice(0, 5);
    }, [messages, searchQuery]);

    const filteredProjects = React.useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        const query = searchQuery.toLowerCase();
        return projects.filter(project => 
            project.title.toLowerCase().includes(query) ||
            (project.titleAr && project.titleAr.toLowerCase().includes(query)) ||
            project.description.toLowerCase().includes(query) ||
            (project.descriptionAr && project.descriptionAr.toLowerCase().includes(query)) ||
            (project.platform && project.platform.toLowerCase().includes(query)) ||
            (project.platformAr && project.platformAr.toLowerCase().includes(query)) ||
            (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query)))
        ).slice(0, 5);
    }, [projects, searchQuery]);

    const filteredSkills = React.useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        const query = searchQuery.toLowerCase();
        return skills.filter(skill => 
            skill.name.toLowerCase().includes(query) ||
            (skill.nameAr && skill.nameAr.toLowerCase().includes(query)) ||
            skill.category.toLowerCase().includes(query)
        ).slice(0, 5);
    }, [skills, searchQuery]);

    const filteredExperience = React.useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        const query = searchQuery.toLowerCase();
        return experience.filter(exp => 
            exp.role.toLowerCase().includes(query) ||
            (exp.roleAr && exp.roleAr.toLowerCase().includes(query)) ||
            exp.company.toLowerCase().includes(query) ||
            (exp.companyAr && exp.companyAr.toLowerCase().includes(query)) ||
            exp.description.toLowerCase().includes(query) ||
            (exp.descriptionAr && exp.descriptionAr.toLowerCase().includes(query)) ||
            exp.period.toLowerCase().includes(query)
        ).slice(0, 5);
    }, [experience, searchQuery]);

    const hasSearchResults = searchQuery.length >= 2 && (
        filteredMessages.length > 0 ||
        filteredProjects.length > 0 ||
        filteredSkills.length > 0 ||
        filteredExperience.length > 0
    );

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setSearchOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    const handleSearchSelect = (href: string) => {
        setSearchOpen(false);
        router.push(href);
    };

    return (
        <>
            <DynamicFavicon />
            <div className="flex h-screen bg-background" dir={direction}>
                <div className="hidden lg:flex shrink-0">
                    <Sidebar />
                </div>

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side={isRTL ? "right" : "left"} className="p-0 w-72">
                        <Sidebar onClose={() => setMobileOpen(false)} />
                    </SheetContent>
                </Sheet>

                <CommandDialog open={searchOpen} onOpenChange={(open: boolean) => {
                    setSearchOpen(open);
                    if (!open) setSearchQuery("");
                }}>
                    <CommandInput 
                        placeholder={currentT.searchPlaceholder} 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList className="max-h-[400px]">
                        <CommandEmpty>{currentT.noResults}</CommandEmpty>
                        <CommandGroup heading={currentT.pages}>
                            {pageItems.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    value={`${item.name} ${item.keywords.join(' ')}`}
                                    onSelect={() => handleSearchSelect(item.href)}
                                    className="cursor-pointer"
                                >
                                    <item.icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    <span>{item.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading={currentT.settings}>
                            {settingsItems.map((item, idx) => (
                                <CommandItem
                                    key={`${item.href}-${idx}`}
                                    value={`${item.name} ${item.keywords.join(' ')}`}
                                    onSelect={() => handleSearchSelect(item.href)}
                                    className="cursor-pointer"
                                >
                                    <item.icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    <span>{item.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading={currentT.content}>
                            {contentItems.map((item, idx) => (
                                <CommandItem
                                    key={`content-${item.href}-${idx}`}
                                    value={`${item.name} ${item.keywords.join(' ')}`}
                                    onSelect={() => handleSearchSelect(item.href)}
                                    className="cursor-pointer"
                                >
                                    <item.icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    <span>{item.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading={currentT.actions}>
                            {actionItems.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    value={`${item.name} ${item.keywords.join(' ')}`}
                                    onSelect={() => handleSearchSelect(item.href)}
                                    className="cursor-pointer"
                                >
                                    <item.icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    <span>{item.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {hasSearchResults && (
                            <>
                                <CommandSeparator />
                                <CommandGroup heading={currentT.searchResults}>
                                    {filteredProjects.map((project) => (
                                        <CommandItem
                                            key={`project-${project._id}`}
                                            value={`project ${project.title} ${project.titleAr || ''} ${project.description}`}
                                            onSelect={() => {
                                                setSearchOpen(false);
                                                setSearchQuery("");
                                                router.push("/dashboard/projects");
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <FolderKanban className={cn("h-4 w-4 shrink-0 text-blue-500", isRTL ? "ml-2" : "mr-2")} />
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="font-medium truncate">
                                                    {language === "ar" && project.titleAr ? project.titleAr : project.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {currentT.inProjects} • {project.platform}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                    {filteredSkills.map((skill) => (
                                        <CommandItem
                                            key={`skill-${skill._id}`}
                                            value={`skill ${skill.name} ${skill.nameAr || ''} ${skill.category}`}
                                            onSelect={() => {
                                                setSearchOpen(false);
                                                setSearchQuery("");
                                                router.push("/dashboard/skills");
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Sparkles className={cn("h-4 w-4 shrink-0 text-yellow-500", isRTL ? "ml-2" : "mr-2")} />
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="font-medium truncate">
                                                    {language === "ar" && skill.nameAr ? skill.nameAr : skill.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {currentT.inSkills} • {skill.category}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                    {filteredExperience.map((exp) => (
                                        <CommandItem
                                            key={`exp-${exp._id}`}
                                            value={`experience ${exp.role} ${exp.roleAr || ''} ${exp.company} ${exp.companyAr || ''}`}
                                            onSelect={() => {
                                                setSearchOpen(false);
                                                setSearchQuery("");
                                                router.push("/dashboard/experience");
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Briefcase className={cn("h-4 w-4 shrink-0 text-green-500", isRTL ? "ml-2" : "mr-2")} />
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="font-medium truncate">
                                                    {language === "ar" && exp.roleAr ? exp.roleAr : exp.role}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {currentT.inExperience} • {language === "ar" && exp.companyAr ? exp.companyAr : exp.company}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                    {filteredMessages.map((msg) => (
                                        <CommandItem
                                            key={`msg-${msg._id}`}
                                            value={`message ${msg.name} ${msg.email} ${msg.message}`}
                                            onSelect={() => {
                                                setSearchOpen(false);
                                                setSearchQuery("");
                                                router.push("/dashboard/messages");
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <MessageSquare className={cn("h-4 w-4 shrink-0 text-purple-500", isRTL ? "ml-2" : "mr-2")} />
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="font-medium truncate">{msg.name}</span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {currentT.inMessages} • {msg.message.slice(0, 40)}...
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </CommandDialog>

                <main className="flex-1 flex flex-col overflow-hidden">
                    <header className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden h-9 w-9"
                                onClick={() => setMobileOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    "relative h-9 w-60 lg:w-72 justify-start text-muted-foreground text-sm",
                                    isRTL ? "text-right" : "text-left"
                                )}
                                onClick={() => setSearchOpen(true)}
                            >
                                <Search className={cn("h-4 w-4 mr-2", isRTL && "ml-2 mr-0")} />
                                <span className="flex-1 truncate">{currentT.searchPlaceholder}</span>
                                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </Button>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="sm:hidden h-9 w-9"
                                onClick={() => setSearchOpen(true)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleLanguage}
                                className="h-9 w-9"
                            >
                                <span className="text-sm font-medium">{language === "en" ? "ع" : "EN"}</span>
                            </Button>
                            <div className="ml-1">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConvexClientProvider>
            <ThemeProvider defaultTheme="light" storageKey="ytech-theme">
                <LanguageProvider>
                    <SignedIn>
                        <DashboardContent>{children}</DashboardContent>
                    </SignedIn>
                    <SignedOut>
                        <RedirectToSignIn />
                    </SignedOut>
                </LanguageProvider>
            </ThemeProvider>
        </ConvexClientProvider>
    );
}
