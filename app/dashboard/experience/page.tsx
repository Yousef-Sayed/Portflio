"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Eye, 
    EyeOff, 
    Database,
    Briefcase,
    Building2,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

// Translations
const translations = {
    en: {
        title: "Work Experience",
        description: "Manage your work history and positions",
        addExperience: "Add Experience",
        editExperience: "Edit Experience",
        seedButton: "Seed Existing Experience",
        seeding: "Seeding...",
        stats: {
            total: "Total Positions",
            current: "Current",
            active: "Active",
            inactive: "Inactive",
        },
        buttons: {
            edit: "Edit",
            hide: "Hide",
            show: "Show",
            delete: "Delete",
        },
        status: {
            current: "Current",
            hidden: "Hidden",
        },
        form: {
            role: "Role / Position",
            roleAr: "Role (Arabic)",
            company: "Company",
            companyAr: "Company (Arabic)",
            period: "Period",
            periodAr: "Period (Arabic)",
            description: "Description",
            descriptionAr: "Description (Arabic)",
            current: "Current Position",
            active: "Active",
            activeDesc: "Active (visible on website)",
            save: "Save",
            saving: "Saving...",
            cancel: "Cancel",
            english: "English",
            arabic: "Arabic",
            arabicNote: "Optional: Provide Arabic translations for the experience details.",
            placeholders: {
                role: "e.g., Full-Stack Developer",
                company: "e.g., Tech Corp",
                period: "e.g., January 2023 - Present",
                description: "Describe your responsibilities and achievements...",
                roleAr: "مثال: مطور ويب شامل",
                companyAr: "مثال: شركة التقنية",
                periodAr: "مثال: يناير 2023 - الآن",
                descriptionAr: "وصف المسؤوليات والإنجازات...",
            },
        },
        empty: {
            title: "No work experience yet",
            description: "Add your first work experience",
        },
        delete: {
            title: "Delete Experience",
            description: "Are you sure you want to delete this work experience? This action cannot be undone.",
            confirm: "Delete",
            cancel: "Cancel",
        },
    },
    ar: {
        title: "الخبرات العملية",
        description: "إدارة سجل عملك والمناصب",
        addExperience: "إضافة خبرة",
        editExperience: "تعديل خبرة",
        seedButton: "تعبئة الخبرات الموجودة",
        seeding: "جاري التعبئة...",
        stats: {
            total: "إجمالي المناصب",
            current: "الحالي",
            active: "النشطة",
            inactive: "غير النشطة",
        },
        buttons: {
            edit: "تعديل",
            hide: "إخفاء",
            show: "إظهار",
            delete: "حذف",
        },
        status: {
            current: "الحالي",
            hidden: "مخفي",
        },
        form: {
            role: "المنصب / الدور",
            roleAr: "المنصب (عربي)",
            company: "الشركة",
            companyAr: "الشركة (عربي)",
            period: "الفترة",
            periodAr: "الفترة (عربي)",
            description: "الوصف",
            descriptionAr: "الوصف (عربي)",
            current: "المنصب الحالي",
            active: "نشط",
            activeDesc: "نشط (مرئي على الموقع)",
            save: "حفظ",
            saving: "جاري الحفظ...",
            cancel: "إلغاء",
            english: "الإنجليزية",
            arabic: "العربية",
            arabicNote: "اختياري: قدم ترجمات عربية لتفاصيل الخبرة.",
            placeholders: {
                role: "مثال: مطور ويب شامل",
                company: "مثال: شركة التقنية",
                period: "مثال: يناير 2023 - الآن",
                description: "وصف المسؤوليات والإنجازات...",
                roleAr: "مثال: مطور ويب شامل",
                companyAr: "مثال: شركة التقنية",
                periodAr: "مثال: يناير 2023 - الآن",
                descriptionAr: "وصف المسؤوليات والإنجازات...",
            },
        },
        empty: {
            title: "لا توجد خبرات بعد",
            description: "أضف خبرتك الأولى",
        },
        delete: {
            title: "حذف الخبرة",
            description: "هل أنت متأكد من حذف هذه الخبرة؟ لا يمكن التراجع عن هذا الإجراء.",
            confirm: "حذف",
            cancel: "إلغاء",
        },
    },
};

interface ExperienceFormData {
    role: string;
    roleAr: string;
    company: string;
    companyAr: string;
    period: string;
    periodAr: string;
    description: string;
    descriptionAr: string;
    current: boolean;
    active: boolean;
}

const initialFormData: ExperienceFormData = {
    role: "",
    roleAr: "",
    company: "",
    companyAr: "",
    period: "",
    periodAr: "",
    description: "",
    descriptionAr: "",
    current: false,
    active: true,
};

export default function ExperiencePage() {
    const { language, direction } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const experience = useQuery(api.experience.getAll);
    const createExperience = useMutation(api.experience.create);
    const updateExperience = useMutation(api.experience.update);
    const deleteExperience = useMutation(api.experience.remove);
    const toggleActive = useMutation(api.experience.toggleActive);
    const seedExperience = useMutation(api.experience.seedExperience);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingExperience, setEditingExperience] = React.useState<Id<"experience"> | null>(null);
    const [formData, setFormData] = React.useState<ExperienceFormData>(initialFormData);
    const [isSaving, setIsSaving] = React.useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = React.useState<Id<"experience"> | null>(null);
    const [isSeeding, setIsSeeding] = React.useState(false);

    // Seed initial experience handler
    const handleSeedExperience = async () => {
        setIsSeeding(true);
        try {
            await seedExperience({});
        } catch (error) {
            console.error("Failed to seed experience:", error);
        } finally {
            setIsSeeding(false);
        }
    };

    // Reset form when dialog closes
    React.useEffect(() => {
        if (!isDialogOpen) {
            setFormData(initialFormData);
            setEditingExperience(null);
        }
    }, [isDialogOpen]);

    // Load experience data when editing
    React.useEffect(() => {
        if (editingExperience && experience) {
            const exp = experience.find(e => e._id === editingExperience);
            if (exp) {
                setFormData({
                    role: exp.role,
                    roleAr: exp.roleAr || "",
                    company: exp.company,
                    companyAr: exp.companyAr || "",
                    period: exp.period,
                    periodAr: exp.periodAr || "",
                    description: exp.description,
                    descriptionAr: exp.descriptionAr || "",
                    current: exp.current || false,
                    active: exp.active,
                });
            }
        }
    }, [editingExperience, experience]);

    const handleOpenCreate = () => {
        setFormData(initialFormData);
        setEditingExperience(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (experienceId: Id<"experience">) => {
        setEditingExperience(experienceId);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.role || !formData.company || !formData.period || !formData.description) {
            return;
        }

        setIsSaving(true);
        try {
            if (editingExperience) {
                await updateExperience({
                    id: editingExperience,
                    role: formData.role,
                    roleAr: formData.roleAr || undefined,
                    company: formData.company,
                    companyAr: formData.companyAr || undefined,
                    period: formData.period,
                    periodAr: formData.periodAr || undefined,
                    description: formData.description,
                    descriptionAr: formData.descriptionAr || undefined,
                    current: formData.current,
                    active: formData.active,
                });
            } else {
                await createExperience({
                    role: formData.role,
                    roleAr: formData.roleAr || undefined,
                    company: formData.company,
                    companyAr: formData.companyAr || undefined,
                    period: formData.period,
                    periodAr: formData.periodAr || undefined,
                    description: formData.description,
                    descriptionAr: formData.descriptionAr || undefined,
                    current: formData.current,
                    active: formData.active,
                });
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save experience:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: Id<"experience">) => {
        try {
            await deleteExperience({ id });
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete experience:", error);
        }
    };

    const handleToggleActive = async (id: Id<"experience">) => {
        try {
            await toggleActive({ id });
        } catch (error) {
            console.error("Failed to toggle experience status:", error);
        }
    };

    if (experience === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6" dir={direction}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t.title}</h1>
                    <p className="text-muted-foreground mt-1">
                        {t.description}
                    </p>
                </div>
                <div className="flex gap-2">
                    {experience.length === 0 && (
                        <Button 
                            onClick={handleSeedExperience} 
                            variant="outline" 
                            className="gap-2"
                            disabled={isSeeding}
                        >
                            <Database className="w-4 h-4" />
                            {isSeeding ? t.seeding : t.seedButton}
                        </Button>
                    )}
                    <Button onClick={handleOpenCreate} className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t.addExperience}
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.total}</p>
                        <p className="text-2xl font-bold text-foreground">{experience.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.current}</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {experience.filter(e => e.current).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.active}</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {experience.filter(e => e.active).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border-gray-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.inactive}</p>
                        <p className="text-2xl font-bold text-muted-foreground">
                            {experience.filter(e => !e.active).length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Experience List */}
            {experience.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Briefcase className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{t.empty.title}</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {t.empty.description}
                        </p>
                        <Button onClick={handleOpenCreate} className="gap-2">
                            <Plus className="w-4 h-4" />
                            {t.addExperience}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {experience.map((exp, index) => (
                        <Card 
                            key={exp._id} 
                            className={cn(
                                "transition-all duration-200 hover:shadow-md relative overflow-hidden",
                                !exp.active && "opacity-60"
                            )}
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent" />
                            
                            <CardContent className="p-6 pl-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <h3 className="font-bold text-xl text-foreground">
                                                {language === "ar" && exp.roleAr ? exp.roleAr : exp.role}
                                            </h3>
                                            {exp.current && (
                                                <Badge className="bg-green-500 text-white gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                    {t.status.current}
                                                </Badge>
                                            )}
                                            {!exp.active && (
                                                <Badge variant="secondary">{t.status.hidden}</Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-lg text-accent mb-2">
                                            <Building2 className="w-4 h-4" />
                                            {language === "ar" && exp.companyAr ? exp.companyAr : exp.company}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Calendar className="w-4 h-4" />
                                            {language === "ar" && exp.periodAr ? exp.periodAr : exp.period}
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed">
                                            {language === "ar" && exp.descriptionAr ? exp.descriptionAr : exp.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleToggleActive(exp._id)}
                                            className="h-9 w-9"
                                            title={exp.active ? t.buttons.hide : t.buttons.show}
                                        >
                                            {exp.active ? (
                                                <Eye className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenEdit(exp._id)}
                                            className="h-9 w-9"
                                            title={t.buttons.edit}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteConfirmId(exp._id)}
                                            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                            title={t.buttons.delete}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
