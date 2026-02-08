"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    Code,
    Server,
    X,
    Save,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

// Translations
const translations = {
    en: {
        title: "Skills",
        description: "Manage your technical skills",
        addSkill: "Add Skill",
        editSkill: "Edit Skill",
        seedButton: "Seed Existing Skills",
        seeding: "Seeding...",
        stats: {
            total: "Total Skills",
            frontend: "Frontend",
            backend: "Backend",
            active: "Active",
        },
        tabs: {
            frontend: "Frontend",
            backend: "Backend",
        },
        form: {
            name: "Skill Name",
            nameAr: "Skill Name (Arabic)",
            category: "Category",
            level: "Proficiency Level",
            active: "Active",
            activeDesc: "Active (visible on website)",
            save: "Save",
            saving: "Saving...",
            cancel: "Cancel",
            english: "English",
            arabic: "Arabic",
            arabicNote: "Optional: Provide Arabic translation for the skill name.",
            beginner: "Beginner",
            intermediate: "Intermediate",
            expert: "Expert",
            selectCategory: "Select category",
        },
        empty: {
            title: "No skills yet",
            description: "Add your first skill",
        },
        delete: {
            title: "Delete Skill",
            description: "Are you sure you want to delete this skill? This action cannot be undone.",
            confirm: "Delete",
            cancel: "Cancel",
        },
    },
    ar: {
        title: "المهارات",
        description: "إدارة مهاراتك التقنية",
        addSkill: "إضافة مهارة",
        editSkill: "تعديل مهارة",
        seedButton: "تعبئة المهارات الموجودة",
        seeding: "جاري التعبئة...",
        stats: {
            total: "إجمالي المهارات",
            frontend: "الواجهة الأمامية",
            backend: "الواجهة الخلفية",
            active: "النشطة",
        },
        tabs: {
            frontend: "الواجهة الأمامية",
            backend: "الواجهة الخلفية",
        },
        form: {
            name: "اسم المهارة",
            nameAr: "اسم المهارة (عربي)",
            category: "الفئة",
            level: "مستوى الإتقان",
            active: "نشط",
            activeDesc: "نشط (مرئي على الموقع)",
            save: "حفظ",
            saving: "جاري الحفظ...",
            cancel: "إلغاء",
            english: "الإنجليزية",
            arabic: "العربية",
            arabicNote: "اختياري: قدم ترجمة عربية لاسم المهارة.",
            beginner: "مبتدئ",
            intermediate: "متوسط",
            expert: "خبير",
            selectCategory: "اختر الفئة",
        },
        empty: {
            title: "لا توجد مهارات بعد",
            description: "أضف مهارتك الأولى",
        },
        delete: {
            title: "حذف المهارة",
            description: "هل أنت متأكد من حذف هذه المهارة؟ لا يمكن التراجع عن هذا الإجراء.",
            confirm: "حذف",
            cancel: "إلغاء",
        },
    },
};

interface SkillFormData {
    name: string;
    nameAr: string;
    category: string;
    level: number;
    active: boolean;
}

const initialFormData: SkillFormData = {
    name: "",
    nameAr: "",
    category: "frontend",
    level: 80,
    active: true,
};

export default function SkillsPage() {
    const { language, direction } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const skills = useQuery(api.skills.getAll);
    const createSkill = useMutation(api.skills.create);
    const updateSkill = useMutation(api.skills.update);
    const deleteSkill = useMutation(api.skills.remove);
    const toggleActive = useMutation(api.skills.toggleActive);
    const seedSkills = useMutation(api.skills.seedSkills);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingSkill, setEditingSkill] = React.useState<Id<"skills"> | null>(null);
    const [formData, setFormData] = React.useState<SkillFormData>(initialFormData);
    const [isSaving, setIsSaving] = React.useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = React.useState<Id<"skills"> | null>(null);
    const [isSeeding, setIsSeeding] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("frontend");

    // Seed initial skills handler
    const handleSeedSkills = async () => {
        setIsSeeding(true);
        try {
            await seedSkills({});
        } catch (error) {
            console.error("Failed to seed skills:", error);
        } finally {
            setIsSeeding(false);
        }
    };

    // Reset form when dialog closes
    React.useEffect(() => {
        if (!isDialogOpen) {
            setFormData(initialFormData);
            setEditingSkill(null);
        }
    }, [isDialogOpen]);

    // Load skill data when editing
    React.useEffect(() => {
        if (editingSkill && skills) {
            const skill = skills.find(s => s._id === editingSkill);
            if (skill) {
                setFormData({
                    name: skill.name,
                    nameAr: skill.nameAr || "",
                    category: skill.category,
                    level: skill.level,
                    active: skill.active,
                });
            }
        }
    }, [editingSkill, skills]);

    const handleOpenCreate = (category?: string) => {
        setFormData({ ...initialFormData, category: category || "frontend" });
        setEditingSkill(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (skillId: Id<"skills">) => {
        setEditingSkill(skillId);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.category) {
            return;
        }

        setIsSaving(true);
        try {
            if (editingSkill) {
                await updateSkill({
                    id: editingSkill,
                    name: formData.name,
                    nameAr: formData.nameAr || undefined,
                    category: formData.category,
                    level: formData.level,
                    active: formData.active,
                });
            } else {
                await createSkill({
                    name: formData.name,
                    nameAr: formData.nameAr || undefined,
                    category: formData.category,
                    level: formData.level,
                    active: formData.active,
                });
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save skill:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: Id<"skills">) => {
        try {
            await deleteSkill({ id });
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
    };

    const handleToggleActive = async (id: Id<"skills">) => {
        try {
            await toggleActive({ id });
        } catch (error) {
            console.error("Failed to toggle skill status:", error);
        }
    };

    if (skills === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    const frontendSkills = skills.filter(s => s.category === "frontend");
    const backendSkills = skills.filter(s => s.category === "backend");

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
                    {skills.length === 0 && (
                        <Button 
                            onClick={handleSeedSkills} 
                            variant="outline" 
                            className="gap-2"
                            disabled={isSeeding}
                        >
                            <Database className="w-4 h-4" />
                            {isSeeding ? t.seeding : t.seedButton}
                        </Button>
                    )}
                    <Button onClick={() => handleOpenCreate()} className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t.addSkill}
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.total}</p>
                        <p className="text-2xl font-bold text-foreground">{skills.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.frontend}</p>
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                            {frontendSkills.length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.backend}</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {backendSkills.length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.active}</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {skills.filter(s => s.active).length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Skills Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="frontend" className="gap-2">
                        <Code className="w-4 h-4" />
                        {t.tabs.frontend} ({frontendSkills.length})
                    </TabsTrigger>
                    <TabsTrigger value="backend" className="gap-2">
                        <Server className="w-4 h-4" />
                        {t.tabs.backend} ({backendSkills.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="frontend" className="mt-6">
                    <SkillsList 
                        skills={frontendSkills}
                        onEdit={handleOpenEdit}
                        onDelete={setDeleteConfirmId}
                        onToggleActive={handleToggleActive}
                        onAdd={() => handleOpenCreate("frontend")}
                        category="frontend"
                    />
                </TabsContent>

                <TabsContent value="backend" className="mt-6">
                    <SkillsList 
                        skills={backendSkills}
                        onEdit={handleOpenEdit}
                        onDelete={setDeleteConfirmId}
                        onToggleActive={handleToggleActive}
                        onAdd={() => handleOpenCreate("backend")}
                        category="backend"
                    />
                </TabsContent>
            </Tabs>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            {editingSkill ? t.editSkill : t.addSkill}
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="english" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="english">{t.form.english}</TabsTrigger>
                            <TabsTrigger value="arabic">{t.form.arabic}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="english" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t.form.name} *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., React / Next.js"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">{t.form.category} *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.form.selectCategory} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="frontend">
                                            <span className="flex items-center gap-2">
                                                <Code className="w-4 h-4" />
                                                {t.tabs.frontend}
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="backend">
                                            <span className="flex items-center gap-2">
                                                <Server className="w-4 h-4" />
                                                {t.tabs.backend}
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>{t.form.level}</Label>
                                    <Badge variant="outline" className="font-mono">
                                        {formData.level}%
                                    </Badge>
                                </div>
                                <Slider
                                    value={[formData.level]}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value[0] }))}
                                    max={100}
                                    min={0}
                                    step={5}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{t.form.beginner}</span>
                                    <span>{t.form.intermediate}</span>
                                    <span>{t.form.expert}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <Label htmlFor="active" className="cursor-pointer">
                                    {t.form.activeDesc}
                                </Label>
                            </div>
                        </TabsContent>

                        <TabsContent value="arabic" className="space-y-4 mt-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                {t.form.arabicNote}
                            </p>
                            
                            <div className="space-y-2">
                                <Label htmlFor="nameAr">{t.form.nameAr}</Label>
                                <Input
                                    id="nameAr"
                                    dir="rtl"
                                    value={formData.nameAr}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                                    placeholder="مثال: ريأكت / نيكست"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {t.form.cancel}
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving || !formData.name}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t.form.saving}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {t.form.save}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            {t.delete.title}
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                        {t.delete.description}
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                            {t.delete.cancel}
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                            className="gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            {t.delete.confirm}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Skills List Component
function SkillsList({ 
    skills, 
    onEdit, 
    onDelete, 
    onToggleActive,
    onAdd,
    category
}: { 
    skills: Array<{
        _id: Id<"skills">;
        name: string;
        nameAr?: string;
        level: number;
        active: boolean;
        category: string;
    }>;
    onEdit: (id: Id<"skills">) => void;
    onDelete: (id: Id<"skills">) => void;
    onToggleActive: (id: Id<"skills">) => void;
    onAdd: () => void;
    category: string;
}) {
    if (skills.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        {category === "frontend" ? (
                            <Code className="w-8 h-8 text-muted-foreground" />
                        ) : (
                            <Server className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No {category} skills yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                        Add your first {category} skill
                    </p>
                    <Button onClick={onAdd} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Skill
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-3">
            {skills.map((skill) => (
                <Card 
                    key={skill._id} 
                    className={cn(
                        "transition-all duration-200 hover:shadow-md",
                        !skill.active && "opacity-60"
                    )}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                    category === "frontend" 
                                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                )}>
                                    {category === "frontend" ? (
                                        <Code className="w-5 h-5" />
                                    ) : (
                                        <Server className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground truncate">
                                            {skill.name}
                                        </h3>
                                        {!skill.active && (
                                            <Badge variant="secondary" className="text-xs">
                                                Hidden
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[150px]">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full transition-all",
                                                    category === "frontend" 
                                                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                                                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                                                )}
                                                style={{ width: `${skill.level}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {skill.level}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onToggleActive(skill._id)}
                                    className="h-8 w-8"
                                >
                                    {skill.active ? (
                                        <Eye className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(skill._id)}
                                    className="h-8 w-8"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(skill._id)}
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
