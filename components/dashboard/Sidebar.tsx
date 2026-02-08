"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    Zap,
    PanelLeftClose,
    PanelLeft,
    Home,
    FolderKanban,
    Sparkles,
    Briefcase,
    Image,
    LogOut,
    User
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
    className?: string;
    onClose?: () => void;
    onLogout?: () => void;
}

const navItems = [
    {
        name: { en: "Overview", ar: "نظرة عامة" },
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: { en: "Hero Section", ar: "قسم البطل" },
        href: "/dashboard/hero",
        icon: Image,
    },
    {
        name: { en: "Projects", ar: "المشاريع" },
        href: "/dashboard/projects",
        icon: FolderKanban,
    },
    {
        name: { en: "Skills", ar: "المهارات" },
        href: "/dashboard/skills",
        icon: Sparkles,
    },
    {
        name: { en: "Experience", ar: "الخبرات" },
        href: "/dashboard/experience",
        icon: Briefcase,
    },
    {
        name: { en: "Messages", ar: "الرسائل" },
        href: "/dashboard/messages",
        icon: MessageSquare,
    },
    {
        name: { en: "Settings", ar: "الإعدادات" },
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        name: { en: "Profile", ar: "الملف الشخصي" },
        href: "/dashboard/profile",
        icon: User,
    },
];

export function Sidebar({ className, onClose, onLogout }: SidebarProps) {
    const { language, direction } = useLanguage();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);
    const [sidebarWidth, setSidebarWidth] = React.useState(260);
    const [isResizing, setIsResizing] = React.useState(false);
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const isRTL = direction === "rtl";

    const minWidth = 220;
    const maxWidth = 340;
    const collapsedWidth = 72;

    // Get branding settings from Convex
    const storedSiteName = useQuery(api.messages.getSetting, { key: "site_name" });
    const storedTagline = useQuery(api.messages.getSetting, { key: "site_tagline" });
    const storedLogo = useQuery(api.messages.getSetting, { key: "site_logo" });

    const brandName = storedSiteName || "YTech";
    const brandTagline = storedTagline || (language === "en" ? "Dashboard" : "لوحة التحكم");
    const brandLogo = storedLogo || null;

    const t = {
        en: {
            collapse: "Collapse",
            expand: "Expand",
            backToSite: "Back to site",
            admin: "Admin",
            logout: "Logout",
        },
        ar: {
            collapse: "طي",
            expand: "توسيع",
            backToSite: "العودة للموقع",
            admin: "مدير",
            logout: "تسجيل الخروج",
        },
    };

    const currentT = t[language as keyof typeof t];

    // Handle resize
    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, []);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            
            const newWidth = isRTL
                ? window.innerWidth - e.clientX
                : e.clientX;
            
            const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            setSidebarWidth(clampedWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, isRTL]);

    const currentWidth = collapsed ? collapsedWidth : sidebarWidth;

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar flex flex-col h-full bg-gradient-to-b from-card to-card/95 border-r border-border/40 relative select-none",
                    "transition-[width] duration-200 ease-out shadow-sm",
                    isResizing && "transition-none",
                    className
                )}
                style={{ width: currentWidth }}
                dir={direction}
            >
                {/* Resize handle - visible on hover */}
                {!collapsed && (
                    <div
                        className={cn(
                            "absolute top-0 bottom-0 w-2 cursor-col-resize z-20 group/resize",
                            "hover:bg-primary/20 active:bg-primary/40 transition-all duration-150",
                            isRTL ? "left-0" : "right-0",
                            isResizing && "bg-primary/40 w-2"
                        )}
                        onMouseDown={handleMouseDown}
                    >
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-muted-foreground/30 opacity-0 group-hover/resize:opacity-100 transition-opacity",
                            isRTL ? "left-0.5" : "right-0.5",
                            isResizing && "opacity-100 bg-primary/60"
                        )} />
                    </div>
                )}

                {/* Header with logo and collapse button */}
                <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {brandLogo ? (
                            <div className={cn(
                                "shrink-0 rounded-xl overflow-hidden shadow-lg shadow-primary/10 ring-2 ring-primary/10",
                                collapsed ? "w-10 h-10" : "w-10 h-10"
                            )}>
                                <img 
                                    src={brandLogo} 
                                    alt={brandName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className={cn(
                                "flex items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80",
                                "shadow-lg shadow-primary/25 shrink-0 ring-2 ring-primary/20",
                                collapsed ? "w-10 h-10" : "w-10 h-10"
                            )}>
                                <Zap className="w-5 h-5 text-primary-foreground" />
                            </div>
                        )}
                        
                        {!collapsed && (
                            <div className="min-w-0 overflow-hidden">
                                <span className="font-bold text-lg leading-tight block truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{brandName}</span>
                                <span className="text-xs text-muted-foreground/80 truncate block">{brandTagline}</span>
                            </div>
                        )}
                    </div>

                    {/* Collapse button in header */}
                    {!collapsed && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg"
                                    onClick={() => setCollapsed(true)}
                                >
                                    <PanelLeftClose className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side={isRTL ? "left" : "right"}>
                                {currentT.collapse}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Expand button when collapsed */}
                {collapsed && (
                    <div className="px-3 pb-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-full h-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg"
                                    onClick={() => setCollapsed(false)}
                                >
                                    <PanelLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side={isRTL ? "left" : "right"}>
                                {currentT.expand}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}

                <Separator className="mx-4 bg-border/40" />

                {/* Navigation */}
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/dashboard" && pathname.startsWith(item.href));
                            const Icon = item.icon;
                            const name = item.name[language as keyof typeof item.name];

                            const linkContent = (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/25"
                                            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                                        collapsed && "justify-center px-0"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 shrink-0 transition-transform duration-200",
                                        !isActive && "group-hover:scale-110"
                                    )} />
                                    
                                    {!collapsed && (
                                        <span className="truncate">{name}</span>
                                    )}
                                </Link>
                            );

                            if (collapsed) {
                                return (
                                    <Tooltip key={item.href}>
                                        <TooltipTrigger asChild>
                                            {linkContent}
                                        </TooltipTrigger>
                                        <TooltipContent side={isRTL ? "left" : "right"}>
                                            {name}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }

                            return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
                        })}
                    </nav>
                </ScrollArea>

                {/* Bottom section */}
                <div className="mt-auto border-t border-border/40">
                    {/* User profile section */}
                    <div className={cn(
                        "p-3 pt-4",
                        collapsed ? "flex justify-center" : ""
                    )}>
                        {collapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-xl bg-muted/30">
                                        <span className="text-sm font-medium">A</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side={isRTL ? "left" : "right"}>
                                    {currentT.admin}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/30">
                                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10">
                                    <span className="text-sm font-medium text-primary">A</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{currentT.admin}</p>
                                </div>
                                <ThemeToggle />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-3 pt-0 pb-4 space-y-1.5">
                        {collapsed ? (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href="/">
                                            <Button variant="ghost" size="icon" className="w-full h-9 hover:bg-muted/80 rounded-lg" aria-label={currentT.backToSite}>
                                                <Home className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side={isRTL ? "left" : "right"}>
                                        {currentT.backToSite}
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="w-full h-9 hover:bg-muted/80 rounded-lg" aria-label={currentT.logout} onClick={onLogout}>
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side={isRTL ? "left" : "right"}>
                                        {currentT.logout}
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        ) : (
                            <>
                                <Link href="/">
                                    <Button variant="ghost" className="w-full justify-start gap-3 h-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg">
                                        <Home className="h-4 w-4" />
                                        <span className="text-sm">{currentT.backToSite}</span>
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="w-full justify-start gap-3 h-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg" onClick={onLogout}>
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm">{currentT.logout}</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}
