"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
    MessageSquare, 
    Calendar, 
    Clock,
    TrendingUp,
    TrendingDown,
    Users,
    ArrowRight,
    Sparkles,
    FolderKanban,
    Briefcase,
    Zap
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { dashboardData } from "@/data/dashboard-data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Type for a message
type Message = {
    _id: string;
    _creationTime: number;
    name: string;
    email: string;
    message: string;
    createdAt: number;
};

// Format date helper with relative time
function formatDate(timestamp: number, language: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Relative time
    if (diffMins < 1) return language === "ar" ? "الآن" : "Just now";
    if (diffMins < 60) return language === "ar" ? `منذ ${diffMins} د` : `${diffMins}m ago`;
    if (diffHours < 24) return language === "ar" ? `منذ ${diffHours} س` : `${diffHours}h ago`;
    if (diffDays < 7) return language === "ar" ? `منذ ${diffDays} ي` : `${diffDays}d ago`;
    
    return date.toLocaleDateString(
        language === "ar" ? "ar-EG" : "en-US",
        { month: "short", day: "numeric" }
    );
}

// Get initials from name
function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Animated stats card component with gradient
function StatsCard({ 
    icon: Icon, 
    label, 
    value, 
    trend,
    trendUp,
    gradient,
    iconColor
}: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    gradient?: string;
    iconColor?: string;
}) {
    return (
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                gradient || "bg-gradient-to-br from-primary/5 to-primary/10"
            )} />
            <CardContent className="p-3 sm:p-5 relative">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="space-y-1 sm:space-y-3 flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{label}</p>
                        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                            <p className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight tabular-nums">{value}</p>
                            {trend && (
                                <div className={cn(
                                    "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                                    trendUp 
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                                )}>
                                    {trendUp ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    <span>{trend}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cn(
                        "w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0",
                        iconColor || "bg-primary/10"
                    )}>
                        <Icon className={cn("w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7", iconColor ? "text-white" : "text-primary")} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Recent messages component with modern design
function RecentMessages({ 
    messages, 
    t,
    language
}: { 
    messages: Message[];
    t: typeof dashboardData.en;
    language: string;
}) {
    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-primary/60" />
                </div>
                <h3 className="text-lg font-medium mb-1">{t.messages.empty}</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                    Messages from your website visitors will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {messages.slice(0, 5).map((msg, index) => (
                <div 
                    key={msg._id} 
                    className={cn(
                        "group flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                        "hover:bg-muted/80 cursor-pointer",
                        index === 0 && "bg-primary/5 border border-primary/10"
                    )}
                >
                    <Avatar className="h-11 w-11 ring-2 ring-background shadow-sm">
                        <AvatarFallback className={cn(
                            "text-sm font-semibold",
                            index === 0 
                                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground" 
                                : "bg-muted"
                        )}>
                            {getInitials(msg.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="font-medium truncate">{msg.name}</p>
                            <span className="text-xs text-muted-foreground shrink-0">
                                {formatDate(msg.createdAt, language)}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                            {msg.message}
                        </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            ))}
        </div>
    );
}

// Loading skeleton with animation
function LoadingSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[140px]" />
                        <Skeleton className="h-3 w-[220px]" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function DashboardHome() {
    const { language, direction } = useLanguage();
    const t = dashboardData[language as keyof typeof dashboardData];
    const isRTL = direction === "rtl";

    // Check if Convex is configured
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;

    // Always call useQuery unconditionally
    const convexMessages = useQuery(api.messages.getAll);
    const convexProjects = useQuery(api.projects.getActive);
    const convexSkills = useQuery(api.skills.getActive);
    const convexExperience = useQuery(api.experience.getActive);

    // Determine if Convex is available
    const isConvexAvailable = hasConvex && convexMessages !== undefined;
    const messages: Message[] = React.useMemo(() => {
        return isConvexAvailable && convexMessages ? convexMessages : [];
    }, [isConvexAvailable, convexMessages]);

    // Additional stats
    const projectsCount = convexProjects?.length ?? 0;
    const skillsCount = convexSkills?.length ?? 0;
    const experienceCount = convexExperience?.length ?? 0;

    // Calculate stats - using state for time-based calculations
    const [currentTime] = React.useState(() => Date.now());
    const { totalMessages, todayMessages, weekMessages } = React.useMemo(() => {
        const oneDayMs = 24 * 60 * 60 * 1000;
        const oneWeekMs = 7 * oneDayMs;
        
        const total = messages.length;
        const today = messages.filter(m => (currentTime - m.createdAt) < oneDayMs).length;
        const week = messages.filter(m => (currentTime - m.createdAt) < oneWeekMs).length;
        
        return { totalMessages: total, todayMessages: today, weekMessages: week };
    }, [messages, currentTime]);

    // Handle Convex not available
    if (!isConvexAvailable) {
        return (
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 lg:p-8 border border-border/50">
                    <Sparkles className="absolute top-4 right-4 w-6 h-6 text-primary/30" />
                    <div className="relative">
                        <h1 className="text-2xl lg:text-3xl font-bold">{t.title}</h1>
                        <p className="text-muted-foreground mt-2 max-w-lg">{t.subtitle}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-2 sm:gap-4 grid-cols-3">
                    <StatsCard icon={MessageSquare} label={t.stats.totalMessages} value="-" />
                    <StatsCard icon={Calendar} label={t.stats.todayMessages} value="-" />
                    <StatsCard icon={Clock} label={t.stats.thisWeek} value="-" />
                </div>

                {/* Recent Messages */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    {t.messages.recent}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {hasConvex ? t.common.loading : t.common.configure}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <LoadingSkeleton />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Primary Stats Grid - Messages */}
            <div className="grid gap-2 sm:gap-4 grid-cols-3">
                <StatsCard 
                    icon={MessageSquare} 
                    label={t.stats.totalMessages} 
                    value={totalMessages}
                    trend={totalMessages > 0 ? "+12%" : undefined}
                    trendUp={true}
                    gradient="bg-gradient-to-br from-blue-500/5 to-blue-500/10"
                    iconColor="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatsCard 
                    icon={Calendar} 
                    label={t.stats.todayMessages} 
                    value={todayMessages}
                    gradient="bg-gradient-to-br from-green-500/5 to-green-500/10"
                    iconColor="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatsCard 
                    icon={Clock} 
                    label={t.stats.thisWeek} 
                    value={weekMessages}
                    trend={weekMessages > 0 ? "+8%" : undefined}
                    trendUp={true}
                    gradient="bg-gradient-to-br from-purple-500/5 to-purple-500/10"
                    iconColor="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Secondary Stats - Content */}
            <div className="grid gap-2 sm:gap-4 grid-cols-3">
                <Link href="/dashboard/projects">
                    <StatsCard 
                        icon={FolderKanban} 
                        label={t.stats.projects} 
                        value={projectsCount}
                        gradient="bg-gradient-to-br from-cyan-500/5 to-cyan-500/10"
                        iconColor="bg-gradient-to-br from-cyan-500 to-cyan-600"
                    />
                </Link>
                <Link href="/dashboard/skills">
                    <StatsCard 
                        icon={Zap} 
                        label={t.stats.skills} 
                        value={skillsCount}
                        gradient="bg-gradient-to-br from-pink-500/5 to-pink-500/10"
                        iconColor="bg-gradient-to-br from-pink-500 to-pink-600"
                    />
                </Link>
                <Link href="/dashboard/experience">
                    <StatsCard 
                        icon={Briefcase} 
                        label={t.stats.experience} 
                        value={experienceCount}
                        gradient="bg-gradient-to-br from-amber-500/5 to-amber-500/10"
                        iconColor="bg-gradient-to-br from-amber-500 to-amber-600"
                    />
                </Link>
            </div>

            {/* Recent Messages */}
            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                </div>
                                {t.messages.recent}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {t.messages.recentDesc}
                            </CardDescription>
                        </div>
                        <Link href="/dashboard/messages">
                            <Button variant="outline" size="sm" className="gap-2">
                                {t.messages.viewAll}
                                <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[380px] pr-4">
                        <RecentMessages 
                            messages={messages} 
                            t={t}
                            language={language}
                        />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
