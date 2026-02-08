"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Mail, 
    Save, 
    Check, 
    Loader2,
    Zap,
    ImageIcon,
    Type,
    Upload,
    Eye,
    X,
    Settings,
    Globe,
    Phone,
    Facebook,
    Github,
    Linkedin,
    Plus,
    Trash2,
    FileDown
} from "lucide-react";

function SettingsContent() {
    const { language, direction } = useLanguage();
    const searchParams = useSearchParams();

    // Get tab from URL or default to branding
    const tabFromUrl = searchParams.get("tab");
    const [activeTab, setActiveTab] = React.useState(tabFromUrl === "general" ? "general" : "branding");

    // Form state
    const [email, setEmail] = React.useState("");
    const [phoneNumbers, setPhoneNumbers] = React.useState<Array<{ id: string; label: string; number: string }>>([]);
    const [facebook, setFacebook] = React.useState("");
    const [github, setGithub] = React.useState("");
    const [linkedin, setLinkedin] = React.useState("");
    const [siteName, setSiteName] = React.useState("YTech");
    const [siteTagline, setSiteTagline] = React.useState("Solutions");
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = React.useState<string | null>(null);
    const [savingField, setSavingField] = React.useState<string | null>(null);
    const [saveStatus, setSaveStatus] = React.useState<Record<string, "idle" | "success" | "error">>({});
    const [generatingCV, setGeneratingCV] = React.useState(false);

    // File input refs
    const logoInputRef = React.useRef<HTMLInputElement>(null);
    const faviconInputRef = React.useRef<HTMLInputElement>(null);

    // Convex
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;
    const storedEmail = useQuery(api.messages.getSetting, { key: "contact_email" });
    const storedPhones = useQuery(api.messages.getSetting, { key: "contact_phones" });
    const storedFacebook = useQuery(api.messages.getSetting, { key: "social_facebook" });
    const storedGithub = useQuery(api.messages.getSetting, { key: "social_github" });
    const storedLinkedin = useQuery(api.messages.getSetting, { key: "social_linkedin" });
    const storedSiteName = useQuery(api.messages.getSetting, { key: "site_name" });
    const storedTagline = useQuery(api.messages.getSetting, { key: "site_tagline" });
    const storedLogo = useQuery(api.messages.getSetting, { key: "site_logo" });
    const storedFavicon = useQuery(api.messages.getSetting, { key: "site_favicon" });
    const updateSetting = useMutation(api.messages.setSetting);

    // Load stored values - use useEffect with individual dependencies
    React.useEffect(() => {
        if (storedEmail !== undefined) setEmail(storedEmail ?? "");
    }, [storedEmail]);

    React.useEffect(() => {
        if (storedPhones !== undefined) {
            try {
                const parsed = storedPhones ? JSON.parse(storedPhones) : [];
                setPhoneNumbers(Array.isArray(parsed) ? parsed : []);
            } catch {
                setPhoneNumbers([]);
            }
        }
    }, [storedPhones]);

    React.useEffect(() => {
        if (storedFacebook !== undefined) setFacebook(storedFacebook ?? "");
    }, [storedFacebook]);

    React.useEffect(() => {
        if (storedGithub !== undefined) setGithub(storedGithub ?? "");
    }, [storedGithub]);

    React.useEffect(() => {
        if (storedLinkedin !== undefined) setLinkedin(storedLinkedin ?? "");
    }, [storedLinkedin]);

    React.useEffect(() => {
        if (storedSiteName !== undefined) setSiteName(storedSiteName ?? "YTech");
    }, [storedSiteName]);

    React.useEffect(() => {
        if (storedTagline !== undefined) setSiteTagline(storedTagline ?? "Solutions");
    }, [storedTagline]);

    React.useEffect(() => {
        if (storedLogo !== undefined) setLogoPreview(storedLogo ?? null);
    }, [storedLogo]);

    React.useEffect(() => {
        if (storedFavicon !== undefined) setFaviconPreview(storedFavicon ?? null);
    }, [storedFavicon]);

    // Update tab when URL changes
    React.useEffect(() => {
        if (tabFromUrl === "general" || tabFromUrl === "branding") {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    // Handle save
    const handleSave = async (key: string, value: string) => {
        setSavingField(key);
        setSaveStatus(prev => ({ ...prev, [key]: "idle" }));

        try {
            if (hasConvex) {
                await updateSetting({ key, value });
            } else {
                // Demo mode - simulate save
                await new Promise(r => setTimeout(r, 500));
            }
            setSaveStatus(prev => ({ ...prev, [key]: "success" }));
            setTimeout(() => setSaveStatus(prev => ({ ...prev, [key]: "idle" })), 2000);
        } catch {
            setSaveStatus(prev => ({ ...prev, [key]: "error" }));
        } finally {
            setSavingField(null);
        }
    };

    // Handle logo upload
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(language === "en" ? "Please upload an image file" : "يرجى تحميل ملف صورة");
                return;
            }
            
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert(language === "en" ? "File size must be less than 2MB" : "يجب أن يكون حجم الملف أقل من 2 ميجابايت");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setLogoPreview(base64);
                // Auto-save to convex
                handleSave("site_logo", base64);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove logo
    const handleRemoveLogo = () => {
        setLogoPreview(null);
        handleSave("site_logo", "");
        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
    };

    // Handle favicon upload
    const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(language === "en" ? "Please upload an image file" : "يرجى تحميل ملف صورة");
                return;
            }
            
            // Validate file size (max 1MB for favicon)
            if (file.size > 1024 * 1024) {
                alert(language === "en" ? "File size must be less than 1MB" : "يجب أن يكون حجم الملف أقل من 1 ميجابايت");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFaviconPreview(base64);
                handleSave("site_favicon", base64);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove favicon
    const handleRemoveFavicon = () => {
        setFaviconPreview(null);
        handleSave("site_favicon", "");
        if (faviconInputRef.current) {
            faviconInputRef.current.value = "";
        }
    };

    const currentT = {
        en: {
            title: "Settings",
            description: "Manage your site settings and preferences",
            branding: "Branding",
            brandingDesc: "Customize your site's identity",
            siteName: "Site Name",
            siteNameDesc: "The name displayed in the header and browser tab",
            siteNamePlaceholder: "Enter site name",
            tagline: "Tagline",
            taglineDesc: "A short description shown below the site name",
            taglinePlaceholder: "Enter tagline",
            logo: "Logo",
            logoDesc: "Upload a custom logo (recommended: 512x512 PNG, JPG or SVG)",
            favicon: "Favicon",
            faviconDesc: "The small icon shown in browser tabs (recommended: 32x32 or 64x64)",
            general: "General",
            generalDesc: "Basic contact information",
            contactEmail: "Contact Email",
            contactEmailDesc: "The email address where visitors can reach you",
            emailPlaceholder: "your@email.com",
            phoneNumbers: "Phone Numbers",
            phoneNumbersDesc: "Add multiple phone numbers for contact",
            phoneLabelPlaceholder: "Label (e.g., Mobile, Office)",
            phonePlaceholder: "+1 234 567 8900",
            addPhone: "Add Phone Number",
            noPhones: "No phone numbers added yet",
            socialLinks: "Social Links",
            socialLinksDesc: "Your social media profiles for the Follow Me section",
            facebookUrl: "Facebook URL",
            facebookPlaceholder: "https://facebook.com/yourprofile",
            githubUrl: "GitHub URL",
            githubPlaceholder: "https://github.com/yourusername",
            linkedinUrl: "LinkedIn URL",
            linkedinPlaceholder: "https://linkedin.com/in/yourprofile",
            save: "Save",
            saving: "Saving...",
            saved: "Saved!",
            error: "Error saving",
            preview: "Preview",
            uploadImage: "Upload Logo",
            changeLogo: "Change Logo",
            removeLogo: "Remove",
            currentLogo: "Current Logo",
            noLogo: "No logo uploaded",
            dragDrop: "Click to upload or drag and drop",
            maxSize: "PNG, JPG or SVG (max 2MB)",
        },
        ar: {
            title: "الإعدادات",
            description: "إدارة إعدادات موقعك وتفضيلاتك",
            branding: "العلامة التجارية",
            brandingDesc: "تخصيص هوية موقعك",
            siteName: "اسم الموقع",
            siteNameDesc: "الاسم المعروض في الرأس وعلامة تبويب المتصفح",
            siteNamePlaceholder: "أدخل اسم الموقع",
            tagline: "الشعار",
            taglineDesc: "وصف قصير يظهر أسفل اسم الموقع",
            taglinePlaceholder: "أدخل الشعار",
            logo: "الشعار",
            logoDesc: "تحميل شعار مخصص (موصى به: 512x512 PNG أو JPG أو SVG)",
            favicon: "أيقونة الموقع",
            faviconDesc: "الأيقونة الصغيرة المعروضة في علامات التبويب (موصى به: 32x32 أو 64x64)",
            general: "عام",
            generalDesc: "معلومات الاتصال الأساسية",
            contactEmail: "البريد الإلكتروني للتواصل",
            contactEmailDesc: "البريد الإلكتروني الذي يمكن للزوار التواصل معك من خلاله",
            emailPlaceholder: "بريدك@الإلكتروني.com",
            phoneNumbers: "أرقام الهاتف",
            phoneNumbersDesc: "إضافة أرقام هاتف متعددة للتواصل",
            phoneLabelPlaceholder: "التسمية (مثال: جوال، مكتب)",
            phonePlaceholder: "+966 12 345 6789",
            addPhone: "إضافة رقم هاتف",
            noPhones: "لم تتم إضافة أرقام هاتف بعد",
            socialLinks: "روابط التواصل الاجتماعي",
            socialLinksDesc: "حساباتك على وسائل التواصل الاجتماعي لقسم تابعني",
            facebookUrl: "رابط فيسبوك",
            facebookPlaceholder: "https://facebook.com/yourprofile",
            githubUrl: "رابط GitHub",
            githubPlaceholder: "https://github.com/yourusername",
            linkedinUrl: "رابط LinkedIn",
            linkedinPlaceholder: "https://linkedin.com/in/yourprofile",
            save: "حفظ",
            saving: "جاري الحفظ...",
            saved: "تم الحفظ!",
            error: "خطأ في الحفظ",
            preview: "معاينة",
            uploadImage: "تحميل الشعار",
            changeLogo: "تغيير الشعار",
            removeLogo: "إزالة",
            currentLogo: "الشعار الحالي",
            noLogo: "لم يتم تحميل شعار",
            dragDrop: "انقر للتحميل أو اسحب وأفلت",
            maxSize: "PNG أو JPG أو SVG (الحد الأقصى 2 ميجابايت)",
        },
    };

    const ct = currentT[language as keyof typeof currentT];

    // Phone number management functions
    const addPhoneNumber = () => {
        const newPhone = { id: Date.now().toString(), label: "", number: "" };
        setPhoneNumbers(prev => [...prev, newPhone]);
    };

    const updatePhoneNumber = (id: string, field: "label" | "number", value: string) => {
        setPhoneNumbers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const removePhoneNumber = (id: string) => {
        setPhoneNumbers(prev => prev.filter(p => p.id !== id));
    };

    const savePhoneNumbers = async () => {
        const validPhones = phoneNumbers.filter(p => p.number.trim());
        await handleSave("contact_phones", JSON.stringify(validPhones));
    };

    const renderSaveButton = (field: string, onClick: () => void, showLabel = true) => {
        const isFieldSaving = savingField === field;
        const fieldStatus = saveStatus[field] || "idle";

        return (
            <Button 
                onClick={onClick}
                disabled={isFieldSaving}
                size={showLabel ? "default" : "icon"}
                className={cn(
                    "gap-2 transition-all",
                    fieldStatus === "success" && "bg-green-600 hover:bg-green-700"
                )}
            >
                {isFieldSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : fieldStatus === "success" ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
                {showLabel && (
                    <span className="hidden sm:inline">
                        {isFieldSaving ? ct.saving : fieldStatus === "success" ? ct.saved : ct.save}
                    </span>
                )}
            </Button>
        );
    };

    return (
        <div className="space-y-6 w-full" dir={direction}>
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">{ct.title}</h1>
                <p className="text-muted-foreground mt-1">{ct.description}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger 
                        value="branding" 
                        className="gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        <span>{ct.branding}</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="general" 
                        className="gap-2"
                    >
                        <Settings className="w-4 h-4" />
                        <span>{ct.general}</span>
                    </TabsTrigger>
                </TabsList>

                {/* Branding Tab */}
                <TabsContent value="branding" className="space-y-6 animate-in fade-in-50 duration-300">
                    {/* Site Name & Tagline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Type className="w-5 h-5 text-primary" />
                                {ct.siteName}
                            </CardTitle>
                            <CardDescription>{ct.siteNameDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">{ct.siteName}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="siteName"
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                            placeholder={ct.siteNamePlaceholder}
                                            className="flex-1"
                                        />
                                        {renderSaveButton("site_name", () => handleSave("site_name", siteName), false)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tagline">{ct.tagline}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="tagline"
                                            value={siteTagline}
                                            onChange={(e) => setSiteTagline(e.target.value)}
                                            placeholder={ct.taglinePlaceholder}
                                            className="flex-1"
                                        />
                                        {renderSaveButton("site_tagline", () => handleSave("site_tagline", siteTagline), false)}
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="pt-4 border-t">
                                <Label className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {ct.preview}
                                </Label>
                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl w-fit">
                                    {logoPreview ? (
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                                            <img 
                                                src={logoPreview} 
                                                alt="Logo preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                                            <Zap className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-bold text-xl block leading-none">{siteName || "YTech"}</span>
                                        <span className="text-sm text-muted-foreground">{siteTagline || "Solutions"}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logo Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                {ct.logo}
                            </CardTitle>
                            <CardDescription>{ct.logoDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Logo preview */}
                                <div className="relative group">
                                    {logoPreview ? (
                                        <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-muted bg-background">
                                            <img 
                                                src={logoPreview} 
                                                alt="Site logo" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                                            <Zap className="w-12 h-12 text-primary-foreground" />
                                        </div>
                                    )}
                                    {logoPreview && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={handleRemoveLogo}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Upload area */}
                                <div className="flex-1 space-y-3">
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className={cn(
                                            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer",
                                            "bg-muted/30 hover:bg-muted/50 transition-colors",
                                            "border-muted-foreground/25 hover:border-primary/50"
                                        )}
                                    >
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {ct.dragDrop}
                                        </span>
                                        <span className="text-xs text-muted-foreground/70 mt-1">
                                            {ct.maxSize}
                                        </span>
                                    </label>
                                    
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            className="gap-2 flex-1 sm:flex-none"
                                            onClick={() => logoInputRef.current?.click()}
                                        >
                                            <Upload className="w-4 h-4" />
                                            {logoPreview ? ct.changeLogo : ct.uploadImage}
                                        </Button>
                                        {logoPreview && (
                                            <Button 
                                                variant="outline" 
                                                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={handleRemoveLogo}
                                            >
                                                <X className="w-4 h-4" />
                                                {ct.removeLogo}
                                            </Button>
                                        )}
                                    </div>

                                    {saveStatus["site_logo"] === "success" && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                                            <Check className="w-3 h-3 mr-1" />
                                            {ct.saved}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Favicon Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Globe className="w-5 h-5 text-primary" />
                                {ct.favicon}
                            </CardTitle>
                            <CardDescription>{ct.faviconDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Favicon preview */}
                                <div className="relative group">
                                    {faviconPreview ? (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg border-2 border-muted bg-background">
                                            <img 
                                                src={faviconPreview} 
                                                alt="Favicon" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border">
                                            <Zap className="w-8 h-8 text-primary" />
                                        </div>
                                    )}
                                    {faviconPreview && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={handleRemoveFavicon}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>

                                {/* Upload area */}
                                <div className="flex-1 space-y-3">
                                    <input
                                        ref={faviconInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFaviconUpload}
                                        className="hidden"
                                        id="favicon-upload"
                                    />
                                    <label
                                        htmlFor="favicon-upload"
                                        className={cn(
                                            "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer",
                                            "bg-muted/30 hover:bg-muted/50 transition-colors",
                                            "border-muted-foreground/25 hover:border-primary/50"
                                        )}
                                    >
                                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {ct.dragDrop}
                                        </span>
                                        <span className="text-xs text-muted-foreground/70 mt-1">
                                            ICO, PNG (max 1MB)
                                        </span>
                                    </label>
                                    
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            className="gap-2"
                                            onClick={() => faviconInputRef.current?.click()}
                                        >
                                            <Upload className="w-4 h-4" />
                                            {faviconPreview ? ct.changeLogo : ct.uploadImage}
                                        </Button>
                                        {faviconPreview && (
                                            <Button 
                                                variant="outline" 
                                                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={handleRemoveFavicon}
                                            >
                                                <X className="w-4 h-4" />
                                                {ct.removeLogo}
                                            </Button>
                                        )}
                                    </div>

                                    {saveStatus["site_favicon"] === "success" && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                                            <Check className="w-3 h-3 mr-1" />
                                            {ct.saved}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-300">
                    {/* Contact Email */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Mail className="w-5 h-5 text-primary" />
                                {ct.contactEmail}
                            </CardTitle>
                            <CardDescription>{ct.contactEmailDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2 max-w-md">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={ct.emailPlaceholder}
                                        className="flex-1"
                                    />
                                    {renderSaveButton("contact_email", () => handleSave("contact_email", email))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Phone Numbers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Phone className="w-5 h-5 text-primary" />
                                {ct.phoneNumbers}
                            </CardTitle>
                            <CardDescription>{ct.phoneNumbersDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {phoneNumbers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-lg">
                                        {ct.noPhones}
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {phoneNumbers.map((phone, index) => (
                                            <div key={phone.id} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
                                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={phone.label}
                                                    onChange={(e) => updatePhoneNumber(phone.id, "label", e.target.value)}
                                                    placeholder={ct.phoneLabelPlaceholder}
                                                    className="w-32 sm:w-40"
                                                />
                                                <Input
                                                    type="tel"
                                                    value={phone.number}
                                                    onChange={(e) => updatePhoneNumber(phone.id, "number", e.target.value)}
                                                    placeholder={ct.phonePlaceholder}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removePhoneNumber(phone.id)}
                                                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={addPhoneNumber}
                                        className="gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {ct.addPhone}
                                    </Button>
                                    {phoneNumbers.length > 0 && renderSaveButton("contact_phones", savePhoneNumbers)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Globe className="w-5 h-5 text-primary" />
                                {ct.socialLinks}
                            </CardTitle>
                            <CardDescription>{ct.socialLinksDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Facebook */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Facebook className="w-4 h-4 text-blue-600" />
                                    {ct.facebookUrl}
                                </Label>
                                <div className="flex gap-2 max-w-lg">
                                    <Input
                                        type="url"
                                        value={facebook}
                                        onChange={(e) => setFacebook(e.target.value)}
                                        placeholder={ct.facebookPlaceholder}
                                        className="flex-1"
                                    />
                                    {renderSaveButton("social_facebook", () => handleSave("social_facebook", facebook), false)}
                                </div>
                            </div>

                            {/* GitHub */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Github className="w-4 h-4" />
                                    {ct.githubUrl}
                                </Label>
                                <div className="flex gap-2 max-w-lg">
                                    <Input
                                        type="url"
                                        value={github}
                                        onChange={(e) => setGithub(e.target.value)}
                                        placeholder={ct.githubPlaceholder}
                                        className="flex-1"
                                    />
                                    {renderSaveButton("social_github", () => handleSave("social_github", github), false)}
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Linkedin className="w-4 h-4 text-blue-700" />
                                    {ct.linkedinUrl}
                                </Label>
                                <div className="flex gap-2 max-w-lg">
                                    <Input
                                        type="url"
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                        placeholder={ct.linkedinPlaceholder}
                                        className="flex-1"
                                    />
                                    {renderSaveButton("social_linkedin", () => handleSave("social_linkedin", linkedin), false)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Generate CV */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileDown className="w-5 h-5 text-primary" />
                                {language === "en" ? "Generate CV" : "إنشاء السيرة الذاتية"}
                            </CardTitle>
                            <CardDescription>
                                {language === "en"
                                    ? "Generate a professional PDF CV from your active portfolio data"
                                    : "إنشاء سيرة ذاتية احترافية بصيغة PDF من بيانات محفظتك النشطة"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={async () => {
                                    setGeneratingCV(true);
                                    try {
                                        const res = await fetch("/api/generate-cv");
                                        if (!res.ok) throw new Error("Failed to generate CV");
                                        const blob = await res.blob();
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = "Youssef_Abdrabboh_CV.pdf";
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    } catch (err) {
                                        console.error(err);
                                        alert(language === "en" ? "Failed to generate CV" : "فشل في إنشاء السيرة الذاتية");
                                    } finally {
                                        setGeneratingCV(false);
                                    }
                                }}
                                disabled={generatingCV}
                                className="gap-2"
                            >
                                {generatingCV ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FileDown className="w-4 h-4" />
                                )}
                                {generatingCV
                                    ? (language === "en" ? "Generating..." : "جاري الإنشاء...")
                                    : (language === "en" ? "Download CV (PDF)" : "تحميل السيرة الذاتية (PDF)")}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Loading fallback for settings
function SettingsLoading() {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <div>
                <div className="h-8 w-32 bg-muted rounded" />
                <div className="h-4 w-64 bg-muted rounded mt-2" />
            </div>
            <div className="h-11 w-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded-lg" />
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<SettingsLoading />}>
            <SettingsContent />
        </Suspense>
    );
}
