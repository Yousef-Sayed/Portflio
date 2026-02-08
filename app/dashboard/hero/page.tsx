"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Save,
    Check,
    Loader2,
    Upload,
    Link as LinkIcon,
    Image as ImageIcon,
    FileText,
    Sparkles,
    X,
    Eye,
    Download,
    Type,
    BarChart3,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

// Translations
const translations = {
    en: {
        title: "Hero Section",
        description: "Manage the hero section content, images, and CV/resume",
        seedButton: "Seed Default Settings",
        tabs: {
            content: "Content",
            media: "Media",
            resume: "CV/Resume",
            stats: "Stats",
        },
        badge: {
            title: "Badge Text",
            description: "The small badge shown above the headline",
        },
        headline: {
            title: "Main Headline",
            description: "The large headline text displayed in the hero section",
        },
        titleBio: {
            title: "Title & Bio",
            description: "Your professional title and short bio",
        },
        buttons: {
            title: "Button Labels",
            description: "Customize the CTA button text",
        },
        heroImage: {
            title: "Hero Image",
            description: "Upload a new image or use an external URL",
            externalUrl: "External URL",
            uploadFile: "Upload File",
            imageUrl: "Image URL",
            uploading: "Uploading...",
            uploadSuccess: "Image uploaded successfully!",
            clickToUpload: "Click to upload an image",
            preview: "Preview",
        },
        cv: {
            title: "CV / Resume",
            description: "Upload your CV or provide an external link",
            externalUrl: "External URL / Path",
            uploadFile: "Upload File",
            resumeUrl: "Resume URL or Path",
            uploading: "Uploading...",
            uploadSuccess: "Resume uploaded successfully!",
            clickToUpload: "Click to upload CV/Resume (PDF, DOC, DOCX)",
            currentResume: "Current Resume",
            preview: "Preview",
            download: "Download",
        },
        quickStats: {
            title: "Quick Stats",
            description: "Display your achievements in the hero section",
            yearsExp: "Years of Experience",
            projectsCompleted: "Projects Completed",
            preview: "Preview",
            yearsExpPreview: "Years of\nExperience",
            projectsPreview: "Projects\nCompleted",
        },
        labels: {
            english: "English",
            arabic: "Arabic",
            titleEn: "Title (English)",
            titleAr: "Title (Arabic)",
            bioEn: "Bio (English)",
            bioAr: "Bio (Arabic)",
            contactBtnEn: "Contact Button (English)",
            contactBtnAr: "Contact Button (Arabic)",
            downloadBtnEn: "Download Button (English)",
            downloadBtnAr: "Download Button (Arabic)",
            imageUrl: "Image URL",
            resumeUrl: "Resume URL or Path",
            yearsExp: "Years of Experience",
            projectsCompleted: "Projects Completed",
            preview: "Preview",
            currentResume: "Current Resume",
            externalUrl: "External URL",
            uploadFile: "Upload File",
            clickToUpload: "Click to upload an image",
            clickToUploadResume: "Click to upload CV/Resume (PDF, DOC, DOCX)",
            uploading: "Uploading...",
            uploadSuccess: "Image uploaded successfully!",
            resumeUploadSuccess: "Resume uploaded successfully!",
        },
    },
    ar: {
        title: "قسم البطل",
        description: "إدارة محتوى قسم البطل والصور والسيرة الذاتية",
        seedButton: "تعبئة الإعدادات الافتراضية",
        tabs: {
            content: "المحتوى",
            media: "الوسائط",
            resume: "السيرة الذاتية",
            stats: "الإحصائيات",
        },
        badge: {
            title: "نص الشارة",
            description: "الشارة الصغيرة المعروضة فوق العنوان",
        },
        headline: {
            title: "العنوان الرئيسي",
            description: "النص الكبير المعروض في قسم البطل",
        },
        titleBio: {
            title: "اللقب والنبذة",
            description: "لقبك المهني ونبذة قصيرة عنك",
        },
        buttons: {
            title: "تسميات الأزرار",
            description: "تخصيص نص أزرار الدعوة للعمل",
        },
        heroImage: {
            title: "صورة البطل",
            description: "رفع صورة جديدة أو استخدام رابط خارجي",
            externalUrl: "رابط خارجي",
            uploadFile: "رفع ملف",
            imageUrl: "رابط الصورة",
            uploading: "جاري الرفع...",
            uploadSuccess: "تم رفع الصورة بنجاح!",
            clickToUpload: "اضغط لرفع صورة",
            preview: "معاينة",
        },
        cv: {
            title: "السيرة الذاتية",
            description: "رفع السيرة الذاتية أو توفير رابط خارجي",
            externalUrl: "رابط خارجي / مسار",
            uploadFile: "رفع ملف",
            resumeUrl: "رابط أو مسار السيرة الذاتية",
            uploading: "جاري الرفع...",
            uploadSuccess: "تم رفع السيرة الذاتية بنجاح!",
            clickToUpload: "اضغط لرفع السيرة الذاتية (PDF, DOC, DOCX)",
            currentResume: "السيرة الذاتية الحالية",
            preview: "معاينة",
            download: "تحميل",
        },
        quickStats: {
            title: "إحصائيات سريعة",
            description: "عرض إنجازاتك في قسم البطل",
            yearsExp: "سنوات الخبرة",
            projectsCompleted: "المشاريع المنجزة",
            preview: "معاينة",
            yearsExpPreview: "سنوات\nالخبرة",
            projectsPreview: "المشاريع\nالمنجزة",
        },
        labels: {
            english: "الإنجليزية",
            arabic: "العربية",
            titleEn: "اللقب (إنجليزي)",
            titleAr: "اللقب (عربي)",
            bioEn: "النبذة (إنجليزي)",
            bioAr: "النبذة (عربي)",
            contactBtnEn: "زر التواصل (إنجليزي)",
            contactBtnAr: "زر التواصل (عربي)",
            downloadBtnEn: "زر التحميل (إنجليزي)",
            downloadBtnAr: "زر التحميل (عربي)",
            imageUrl: "رابط الصورة",
            resumeUrl: "رابط أو مسار السيرة الذاتية",
            yearsExp: "سنوات الخبرة",
            projectsCompleted: "المشاريع المنجزة",
            preview: "معاينة",
            currentResume: "السيرة الذاتية الحالية",
            externalUrl: "رابط خارجي",
            uploadFile: "رفع ملف",
            clickToUpload: "اضغط لرفع صورة",
            clickToUploadResume: "اضغط لرفع السيرة الذاتية (PDF, DOC, DOCX)",
            uploading: "جاري الرفع...",
            uploadSuccess: "تم رفع الصورة بنجاح!",
            resumeUploadSuccess: "تم رفع السيرة الذاتية بنجاح!",
        },
    },
};

export default function HeroSettingsPage() {
    const { language, direction } = useLanguage();
    const t = translations[language as keyof typeof translations];
    // Form state
    const [heroImage, setHeroImage] = React.useState("");
    const [heroImageType, setHeroImageType] = React.useState<"url" | "upload">("url");
    const [headlineEn, setHeadlineEn] = React.useState("");
    const [headlineAr, setHeadlineAr] = React.useState("");
    const [subheadlineEn, setSubheadlineEn] = React.useState("");
    const [subheadlineAr, setSubheadlineAr] = React.useState("");
    const [badgeEn, setBadgeEn] = React.useState("");
    const [badgeAr, setBadgeAr] = React.useState("");
    const [titleEn, setTitleEn] = React.useState("");
    const [titleAr, setTitleAr] = React.useState("");
    const [bioEn, setBioEn] = React.useState("");
    const [bioAr, setBioAr] = React.useState("");
    const [resumeUrl, setResumeUrl] = React.useState("");
    const [resumeType, setResumeType] = React.useState<"url" | "upload">("url");
    const [yearsExperience, setYearsExperience] = React.useState("");
    const [projectsCompleted, setProjectsCompleted] = React.useState("");
    const [contactBtnEn, setContactBtnEn] = React.useState("");
    const [contactBtnAr, setContactBtnAr] = React.useState("");
    const [downloadBtnEn, setDownloadBtnEn] = React.useState("");
    const [downloadBtnAr, setDownloadBtnAr] = React.useState("");

    // Upload states
    const [imageUploading, setImageUploading] = React.useState(false);
    const [resumeUploading, setResumeUploading] = React.useState(false);
    const [imageUploadSuccess, setImageUploadSuccess] = React.useState(false);
    const [resumeUploadSuccess, setResumeUploadSuccess] = React.useState(false);

    // Saving states
    const [savingField, setSavingField] = React.useState<string | null>(null);
    const [saveStatus, setSaveStatus] = React.useState<Record<string, "idle" | "success" | "error">>({});

    // Refs
    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const resumeInputRef = React.useRef<HTMLInputElement>(null);

    // Convex queries and mutations
    const heroSettings = useQuery(api.hero.getSettings);
    const updateSettings = useMutation(api.hero.updateSettings);
    const seedSettings = useMutation(api.hero.seedHeroSettings);
    const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
    const getImageUrl = useMutation(api.storage.getImageUrl);

    // Load existing settings
    React.useEffect(() => {
        if (heroSettings) {
            setHeroImage(heroSettings.heroImage || "");
            setHeroImageType((heroSettings.heroImageType as "url" | "upload") || "url");
            setHeadlineEn(heroSettings.headlineEn || "");
            setHeadlineAr(heroSettings.headlineAr || "");
            setSubheadlineEn(heroSettings.subheadlineEn || "");
            setSubheadlineAr(heroSettings.subheadlineAr || "");
            setBadgeEn(heroSettings.badgeEn || "");
            setBadgeAr(heroSettings.badgeAr || "");
            setTitleEn(heroSettings.titleEn || "");
            setTitleAr(heroSettings.titleAr || "");
            setBioEn(heroSettings.bioEn || "");
            setBioAr(heroSettings.bioAr || "");
            setResumeUrl(heroSettings.resumeUrl || "");
            setResumeType((heroSettings.resumeType as "url" | "upload") || "url");
            setYearsExperience(heroSettings.yearsExperience || "");
            setProjectsCompleted(heroSettings.projectsCompleted || "");
            setContactBtnEn(heroSettings.contactBtnEn || "");
            setContactBtnAr(heroSettings.contactBtnAr || "");
            setDownloadBtnEn(heroSettings.downloadBtnEn || "");
            setDownloadBtnAr(heroSettings.downloadBtnAr || "");
        }
    }, [heroSettings]);

    // Save field handler
    const saveField = async (field: string, value: string, additionalFields?: Record<string, string>) => {
        setSavingField(field);
        try {
            const updateData: Record<string, string> = { [field]: value, ...additionalFields };
            await updateSettings(updateData);
            setSaveStatus((prev) => ({ ...prev, [field]: "success" }));
            setTimeout(() => {
                setSaveStatus((prev) => ({ ...prev, [field]: "idle" }));
            }, 2000);
        } catch (error) {
            console.error("Error saving:", error);
            setSaveStatus((prev) => ({ ...prev, [field]: "error" }));
        } finally {
            setSavingField(null);
        }
    };

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageUploading(true);
        setImageUploadSuccess(false);

        try {
            const uploadUrl = await generateUploadUrl();
            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!response.ok) throw new Error("Upload failed");

            const { storageId } = await response.json();
            const imageUrl = await getImageUrl({ storageId });

            if (imageUrl) {
                setHeroImage(imageUrl);
                setHeroImageType("upload");
                await saveField("heroImage", imageUrl, { heroImageType: "upload" });
                setImageUploadSuccess(true);
                setTimeout(() => setImageUploadSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setImageUploading(false);
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    };

    // Resume upload handler
    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResumeUploading(true);
        setResumeUploadSuccess(false);

        try {
            const uploadUrl = await generateUploadUrl();
            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!response.ok) throw new Error("Upload failed");

            const { storageId } = await response.json();
            const fileUrl = await getImageUrl({ storageId });

            if (fileUrl) {
                setResumeUrl(fileUrl);
                setResumeType("upload");
                await saveField("resumeUrl", fileUrl, { resumeType: "upload" });
                setResumeUploadSuccess(true);
                setTimeout(() => setResumeUploadSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setResumeUploading(false);
            if (resumeInputRef.current) resumeInputRef.current.value = "";
        }
    };

    // Seed default settings
    const handleSeed = async () => {
        await seedSettings();
    };

    const getSaveIcon = (field: string) => {
        if (savingField === field) return <Loader2 className="w-4 h-4 animate-spin" />;
        if (saveStatus[field] === "success") return <Check className="w-4 h-4 text-green-500" />;
        return <Save className="w-4 h-4" />;
    };

    return (
        <div className="space-y-6" dir={direction}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-primary" />
                        {t.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t.description}
                    </p>
                </div>
            </div>

            <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content" className="gap-2">
                        <Type className="w-4 h-4" />
                        {t.tabs.content}
                    </TabsTrigger>
                    <TabsTrigger value="resume" className="gap-2">
                        <FileText className="w-4 h-4" />
                        {t.tabs.resume}
                    </TabsTrigger>
                    <TabsTrigger value="media" className="gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {t.tabs.media}
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        {t.tabs.stats}
                    </TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                    {/* Badge */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Badge</Badge>
                                {t.badge.title}
                            </CardTitle>
                            <CardDescription>
                                {t.badge.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t.labels.english}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={badgeEn}
                                            onChange={(e) => setBadgeEn(e.target.value)}
                                            placeholder="Available for freelance work"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("badgeEn", badgeEn)}
                                            disabled={savingField === "badgeEn"}
                                        >
                                            {getSaveIcon("badgeEn")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.labels.arabic}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={badgeAr}
                                            onChange={(e) => setBadgeAr(e.target.value)}
                                            placeholder="متاح للعمل الحر"
                                            dir="rtl"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("badgeAr", badgeAr)}
                                            disabled={savingField === "badgeAr"}
                                        >
                                            {getSaveIcon("badgeAr")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Headline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.headline.title}</CardTitle>
                            <CardDescription>
                                {t.headline.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t.labels.english}</Label>
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={headlineEn}
                                            onChange={(e) => setHeadlineEn(e.target.value)}
                                            placeholder="Crafting Digital High-End Solutions"
                                            rows={2}
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("headlineEn", headlineEn)}
                                            disabled={savingField === "headlineEn"}
                                        >
                                            {getSaveIcon("headlineEn")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.labels.arabic}</Label>
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={headlineAr}
                                            onChange={(e) => setHeadlineAr(e.target.value)}
                                            placeholder="أصنع تجارب رقمية متكاملة"
                                            rows={2}
                                            dir="rtl"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("headlineAr", headlineAr)}
                                            disabled={savingField === "headlineAr"}
                                        >
                                            {getSaveIcon("headlineAr")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Title & Bio */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.titleBio.title}</CardTitle>
                            <CardDescription>
                                {t.titleBio.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t.labels.titleEn}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={titleEn}
                                            onChange={(e) => setTitleEn(e.target.value)}
                                            placeholder="Software Engineer"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("titleEn", titleEn)}
                                            disabled={savingField === "titleEn"}
                                        >
                                            {getSaveIcon("titleEn")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.labels.titleAr}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={titleAr}
                                            onChange={(e) => setTitleAr(e.target.value)}
                                            placeholder="مهندس برمجيات"
                                            dir="rtl"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("titleAr", titleAr)}
                                            disabled={savingField === "titleAr"}
                                        >
                                            {getSaveIcon("titleAr")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t.labels.bioEn}</Label>
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={bioEn}
                                            onChange={(e) => setBioEn(e.target.value)}
                                            placeholder="Your professional bio..."
                                            rows={3}
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("bioEn", bioEn)}
                                            disabled={savingField === "bioEn"}
                                        >
                                            {getSaveIcon("bioEn")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.labels.bioAr}</Label>
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={bioAr}
                                            onChange={(e) => setBioAr(e.target.value)}
                                            placeholder="نبذة عنك..."
                                            rows={3}
                                            dir="rtl"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("bioAr", bioAr)}
                                            disabled={savingField === "bioAr"}
                                        >
                                            {getSaveIcon("bioAr")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Button Labels */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.buttons.title}</CardTitle>
                            <CardDescription>
                                {t.buttons.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t.labels.contactBtnEn}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={contactBtnEn}
                                            onChange={(e) => setContactBtnEn(e.target.value)}
                                            placeholder="Contact Me"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("contactBtnEn", contactBtnEn)}
                                            disabled={savingField === "contactBtnEn"}
                                        >
                                            {getSaveIcon("contactBtnEn")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.labels.contactBtnAr}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={contactBtnAr}
                                            onChange={(e) => setContactBtnAr(e.target.value)}
                                            placeholder="تواصل معي"
                                            dir="rtl"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("contactBtnAr", contactBtnAr)}
                                            disabled={savingField === "contactBtnAr"}
                                        >
                                            {getSaveIcon("contactBtnAr")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t.labels.downloadBtnEn}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={downloadBtnEn}
                                            onChange={(e) => setDownloadBtnEn(e.target.value)}
                                            placeholder="Download CV"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("downloadBtnEn", downloadBtnEn)}
                                            disabled={savingField === "downloadBtnEn"}
                                        >
                                            {getSaveIcon("downloadBtnEn")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.labels.downloadBtnAr}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={downloadBtnAr}
                                            onChange={(e) => setDownloadBtnAr(e.target.value)}
                                            placeholder="تحميل السيرة الذاتية"
                                            dir="rtl"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("downloadBtnAr", downloadBtnAr)}
                                            disabled={savingField === "downloadBtnAr"}
                                        >
                                            {getSaveIcon("downloadBtnAr")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                {t.heroImage.title}
                            </CardTitle>
                            <CardDescription>
                                {t.heroImage.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Image Source Toggle */}
                            <div className="flex items-center gap-4">
                                <Button
                                    variant={heroImageType === "url" ? "default" : "outline"}
                                    onClick={() => setHeroImageType("url")}
                                    className="gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    {t.heroImage.externalUrl}
                                </Button>
                                <Button
                                    variant={heroImageType === "upload" ? "default" : "outline"}
                                    onClick={() => setHeroImageType("upload")}
                                    className="gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    {t.heroImage.uploadFile}
                                </Button>
                            </div>

                            {/* URL Input */}
                            {heroImageType === "url" && (
                                <div className="space-y-2">
                                    <Label>{t.heroImage.imageUrl}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={heroImage}
                                            onChange={(e) => setHeroImage(e.target.value)}
                                            placeholder="https://example.com/image.png or /my-image.png"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("heroImage", heroImage, { heroImageType: "url" })}
                                            disabled={savingField === "heroImage"}
                                        >
                                            {getSaveIcon("heroImage")}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* File Upload */}
                            {heroImageType === "upload" && (
                                <div className="space-y-4">
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => imageInputRef.current?.click()}
                                        disabled={imageUploading}
                                        className="gap-2 w-full h-32 border-dashed"
                                    >
                                        {imageUploading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                {t.heroImage.uploading}
                                            </>
                                        ) : imageUploadSuccess ? (
                                            <>
                                                <Check className="w-6 h-6 text-green-500" />
                                                {t.heroImage.uploadSuccess}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6" />
                                                {t.heroImage.clickToUpload}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Image Preview */}
                            {heroImage && (
                                <div className="space-y-2">
                                    <Label>{t.heroImage.preview}</Label>
                                    <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-muted">
                                        <Image
                                            src={heroImage}
                                            alt="Hero preview"
                                            fill
                                            className="object-contain"
                                        />
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setHeroImage("");
                                                saveField("heroImage", "");
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Resume Tab */}
                <TabsContent value="resume" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                {t.cv.title}
                            </CardTitle>
                            <CardDescription>
                                {t.cv.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Source Toggle */}
                            <div className="flex items-center gap-4">
                                <Button
                                    variant={resumeType === "url" ? "default" : "outline"}
                                    onClick={() => setResumeType("url")}
                                    className="gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    {t.cv.externalUrl}
                                </Button>
                                <Button
                                    variant={resumeType === "upload" ? "default" : "outline"}
                                    onClick={() => setResumeType("upload")}
                                    className="gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    {t.cv.uploadFile}
                                </Button>
                            </div>

                            {/* URL Input */}
                            {resumeType === "url" && (
                                <div className="space-y-2">
                                    <Label>{t.cv.resumeUrl}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={resumeUrl}
                                            onChange={(e) => setResumeUrl(e.target.value)}
                                            placeholder="/Youssef_Sayed_Backend.pdf or https://..."
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("resumeUrl", resumeUrl, { resumeType: "url" })}
                                            disabled={savingField === "resumeUrl"}
                                        >
                                            {getSaveIcon("resumeUrl")}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* File Upload */}
                            {resumeType === "upload" && (
                                <div className="space-y-4">
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => resumeInputRef.current?.click()}
                                        disabled={resumeUploading}
                                        className="gap-2 w-full h-32 border-dashed"
                                    >
                                        {resumeUploading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                {t.cv.uploading}
                                            </>
                                        ) : resumeUploadSuccess ? (
                                            <>
                                                <Check className="w-6 h-6 text-green-500" />
                                                {t.cv.uploadSuccess}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6" />
                                                {t.cv.clickToUpload}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Current Resume */}
                            {resumeUrl && (
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-primary" />
                                        <div>
                                            <p className="font-medium">{t.cv.currentResume}</p>
                                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                                                {resumeUrl}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                                <Eye className="w-4 h-4 mr-2" />
                                                {t.cv.preview}
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={resumeUrl} download>
                                                <Download className="w-4 h-4 mr-2" />
                                                {t.cv.download}
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                {t.quickStats.title}
                            </CardTitle>
                            <CardDescription>
                                {t.quickStats.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t.quickStats.yearsExp}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={yearsExperience}
                                            onChange={(e) => setYearsExperience(e.target.value)}
                                            placeholder="5+"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("yearsExperience", yearsExperience)}
                                            disabled={savingField === "yearsExperience"}
                                        >
                                            {getSaveIcon("yearsExperience")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.quickStats.projectsCompleted}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={projectsCompleted}
                                            onChange={(e) => setProjectsCompleted(e.target.value)}
                                            placeholder="50+"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => saveField("projectsCompleted", projectsCompleted)}
                                            disabled={savingField === "projectsCompleted"}
                                        >
                                            {getSaveIcon("projectsCompleted")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Preview */}
                            <div className="p-6 rounded-lg bg-muted/50 border">
                                <p className="text-sm text-muted-foreground mb-4">{t.quickStats.preview}:</p>
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold">{yearsExperience || "5+"}</span>
                                        <span className="text-xs uppercase tracking-widest leading-none">{t.quickStats.yearsExpPreview}</span>
                                    </div>
                                    <div className="w-px h-8 bg-border" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold">{projectsCompleted || "50+"}</span>
                                        <span className="text-xs uppercase tracking-widest leading-none">{t.quickStats.projectsPreview}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
