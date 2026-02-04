"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    MessageSquare,
    Calendar,
    Mail,
    Clock,
    Copy,
    Check,
    Eye,
    Search,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { dashboardData } from "@/data/dashboard-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Type for a message
type Message = {
    _id: string;
    _creationTime: number;
    name: string;
    email: string;
    message: string;
    createdAt: number;
};

// Sort order type
type SortOrder = "newest" | "oldest" | "name-asc" | "name-desc";

// Format date helper - modern, clean design
function formatDate(timestamp: number, language: string, format: "full" | "relative" | "compact" = "full"): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const locale = language === "ar" ? "ar-EG" : "en-US";
    
    // Relative time for recent messages
    if (format === "relative") {
        if (diffMins < 1) return language === "ar" ? "الآن" : "Just now";
        if (diffMins < 60) return language === "ar" ? `منذ ${diffMins} دقيقة` : `${diffMins} min ago`;
        if (diffHours < 24) return language === "ar" ? `منذ ${diffHours} ساعة` : `${diffHours} hours ago`;
        if (diffDays === 1) return language === "ar" ? "أمس" : "Yesterday";
        if (diffDays < 7) return language === "ar" ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
        if (diffDays < 30) return language === "ar" ? `منذ ${Math.floor(diffDays / 7)} أسابيع` : `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
    }
    
    // Compact format for table - shows date and time separately
    if (format === "compact") {
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = diffDays === 1 && diffHours < 48;
        
        if (isToday) {
            return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
        }
        if (isYesterday) {
            return language === "ar" ? "أمس" : "Yesterday";
        }
        return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
    }
    
    // Full format with date and time
    return date.toLocaleDateString(locale, { 
        month: "short", 
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    }) + " • " + date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
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

// Message detail modal
function MessageDetail({
    message,
    onClose,
    t
}: {
    message: Message;
    onClose: () => void;
    t: typeof dashboardData.en;
}) {
    const [copied, setCopied] = React.useState(false);
    const { language } = useLanguage();

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(message.message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-start justify-between pb-4 border-b bg-muted/30">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                                {getInitials(message.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-xl">{message.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                <a href={`mailto:${message.email}`} className="hover:underline">
                                    {message.email}
                                </a>
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        ×
                    </Button>
                </CardHeader>
                <ScrollArea className="max-h-[50vh] p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(message.createdAt, language, "full")}
                            </div>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(message.createdAt, language, "relative")}
                            </Badge>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <p className="text-sm font-medium mb-2">{t.messages.message}:</p>
                            <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
                        </div>
                    </div>
                </ScrollArea>
                <div className="flex justify-between gap-2 p-4 border-t bg-muted/30">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                {t.common.copied}
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-1" />
                                {t.common.copy}
                            </>
                        )}
                    </Button>
                    <Button size="sm" onClick={() => window.location.href = `mailto:${message.email}`}>
                        <Mail className="w-4 h-4 mr-1" />
                        {t.messages.reply}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

// Empty state component
function EmptyState({ t }: { t: typeof dashboardData.en }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.messages.empty}</h3>
            <p className="text-muted-foreground max-w-md">{t.messages.emptyDescription}</p>
        </div>
    );
}

export default function MessagesPage() {
    const { language, direction } = useLanguage();
    const t = dashboardData[language as keyof typeof dashboardData];
    const isRTL = direction === "rtl";
    const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState<SortOrder>("newest");

    // Check if Convex is configured
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;

    // Always call useQuery unconditionally
    const convexMessages = useQuery(api.messages.getAll);

    // Determine if Convex is available
    const isConvexAvailable = hasConvex && convexMessages !== undefined;
    const messages: Message[] = React.useMemo(() => {
        return isConvexAvailable && convexMessages ? convexMessages : [];
    }, [isConvexAvailable, convexMessages]);

    // Sort messages
    const sortedMessages = React.useMemo(() => {
        const sorted = [...messages];
        switch (sortOrder) {
            case "newest":
                return sorted.sort((a, b) => b.createdAt - a.createdAt);
            case "oldest":
                return sorted.sort((a, b) => a.createdAt - b.createdAt);
            case "name-asc":
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case "name-desc":
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return sorted;
        }
    }, [messages, sortOrder]);

    // Filter messages by search query
    const filteredMessages = React.useMemo(() => {
        if (!searchQuery.trim()) return sortedMessages;
        const query = searchQuery.toLowerCase();
        return sortedMessages.filter(
            (m) =>
                m.name.toLowerCase().includes(query) ||
                m.email.toLowerCase().includes(query) ||
                m.message.toLowerCase().includes(query)
        );
    }, [sortedMessages, searchQuery]);

    // Calculate this week's messages
    const weekMessages = React.useMemo(() => {
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        return messages.filter(m => (now - m.createdAt) < oneWeekMs).length;
    }, [messages]);

    // Handle Convex not available
    if (!isConvexAvailable) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">{t.messages.title}</h1>
                    <p className="text-muted-foreground mt-1">{t.messages.description}</p>
                </div>

                <Card>
                    <CardContent className="py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {hasConvex ? "Loading messages..." : "Convex not configured"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t.messages.title}</h1>
                    <p className="text-muted-foreground mt-1">{t.messages.description}</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <Search className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                            isRTL && "left-auto right-3"
                        )} />
                        <Input
                            placeholder={t.messages.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full sm:w-64 pl-10",
                                isRTL && "pl-4 pr-10"
                            )}
                        />
                    </div>

                    {/* Sort */}
                    <Select
                        value={sortOrder}
                        onValueChange={(value: string) => setSortOrder(value as SortOrder)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={t.messages.sortBy} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">
                                <div className="flex items-center gap-2">
                                    <ArrowDown className="w-4 h-4" />
                                    {t.messages.newest}
                                </div>
                            </SelectItem>
                            <SelectItem value="oldest">
                                <div className="flex items-center gap-2">
                                    <ArrowUp className="w-4 h-4" />
                                    {t.messages.oldest}
                                </div>
                            </SelectItem>
                            <SelectItem value="name-asc">
                                <div className="flex items-center gap-2">
                                    <ArrowUp className="w-4 h-4" />
                                    {t.messages.nameAZ}
                                </div>
                            </SelectItem>
                            <SelectItem value="name-desc">
                                <div className="flex items-center gap-2">
                                    <ArrowDown className="w-4 h-4" />
                                    {t.messages.nameZA}
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2">
                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t.stats.totalMessages}</p>
                                <p className="text-2xl font-bold">{messages.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t.stats.thisWeek}</p>
                                <p className="text-2xl font-bold">{weekMessages}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Messages Table */}
            <Card className="overflow-hidden">
                {filteredMessages.length > 0 ? (
                    <div className="border-t">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[250px]">{t.messages.name}</TableHead>
                                    <TableHead className="w-[250px]">{t.messages.email}</TableHead>
                                    <TableHead className="hidden md:table-cell">{t.messages.message}</TableHead>
                                    <TableHead className="w-[150px]">{t.messages.date}</TableHead>
                                    <TableHead className="w-[80px] text-right">{t.messages.actions}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMessages.map((msg) => (
                                    <TableRow 
                                        key={msg._id} 
                                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedMessage(msg)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                                                        {getInitials(msg.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{msg.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={`mailto:${msg.email}`}
                                                className="text-primary hover:underline flex items-center gap-1 text-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate max-w-[200px]">{msg.email}</span>
                                            </a>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <p className="max-w-[300px] truncate text-muted-foreground text-sm">
                                                {msg.message}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-sm font-medium">
                                                    {formatDate(msg.createdAt, isRTL ? "ar" : "en", "compact")}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(msg.createdAt, isRTL ? "ar" : "en", "relative")}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMessage(msg);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <CardContent>
                        <EmptyState t={t} />
                    </CardContent>
                )}
            </Card>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <MessageDetail
                    message={selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    t={t}
                />
            )}
        </div>
    );
}
