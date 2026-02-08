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
    ExternalLink, 
    GripVertical,
    Globe,
    Smartphone,
    Star,
    X,
    Save,
    Image as ImageIcon,
    Link as LinkIcon,
    Tags,
    Database,
    Upload,
    Loader2
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

// Translations
const translations = {
    en: {
        title: "Projects",
        description: "Manage your portfolio projects",
        addProject: "Add Project",
        editProject: "Edit Project",
        seedButton: "Seed Existing Projects",
        seeding: "Seeding...",
        stats: {
            total: "Total Projects",
            active: "Active",
            featured: "Featured",
            inactive: "Inactive",
        },
        empty: {
            title: "No projects yet",
            description: "Get started by adding your first project",
            button: "Add Your First Project",
        },
        form: {
            save: "Save",
            saving: "Saving...",
            cancel: "Cancel",
            basicInfo: "Basic Info",
            links: "Links",
            arabic: "Arabic",
            title: "Project Title",
            slug: "URL Slug",
            description: "Description",
            image: "Project Image",
            url: "URL",
            upload: "Upload",
            tags: "Tags",
            addTag: "Add tag...",
            platform: "Platform",
            selectPlatform: "Select platform",
            featured: "Featured",
            active: "Active (visible on website)",
            liveUrl: "Live URL",
            playStoreUrl: "Play Store URL",
            githubUrl: "GitHub URL",
            arabicTitle: "Arabic Title",
            arabicDesc: "Arabic Description",
            arabicPlatform: "Arabic Platform",
            arabicNote: "Optional: Provide Arabic translations for the project.",
            placeholders: {
                title: "My Awesome Project",
                slug: "my-awesome-project",
                description: "A brief description of the project...",
                imageUrl: "https://example.com/image.jpg or /local-image.png",
                addTag: "Add a tag...",
                liveUrl: "https://example.com",
                playStoreUrl: "https://play.google.com/store/apps/...",
                githubUrl: "https://github.com/...",
            },
            tagsLabel: "Technologies / Tags",
            addButton: "Add",
        },
        delete: {
            title: "Delete Project",
            description: "Are you sure you want to delete this project? This action cannot be undone.",
            confirm: "Delete",
            cancel: "Cancel",
        },
        buttons: {
            edit: "Edit",
            hide: "Hide",
            show: "Show",
            view: "View",
            delete: "Delete",
        },
        status: {
            active: "Active",
            inactive: "Inactive",
            featured: "Featured",
        },
    },
    ar: {
        title: "المشاريع",
        description: "إدارة مشاريع معرض أعمالك",
        addProject: "إضافة مشروع",
        editProject: "تعديل مشروع",
        seedButton: "تعبئة المشاريع الموجودة",
        seeding: "جاري التعبئة...",
        stats: {
            total: "إجمالي المشاريع",
            active: "النشطة",
            featured: "المميزة",
            inactive: "غير النشطة",
        },
        empty: {
            title: "لا توجد مشاريع بعد",
            description: "ابدأ بإضافة مشروعك الأول",
            button: "أضف مشروعك الأول",
        },
        form: {
            save: "حفظ",
            saving: "جاري الحفظ...",
            cancel: "إلغاء",
            basicInfo: "المعلومات الأساسية",
            links: "الروابط",
            arabic: "العربية",
            title: "عنوان المشروع",
            slug: "الرابط المختصر",
            description: "الوصف",
            image: "صورة المشروع",
            url: "رابط",
            upload: "رفع",
            tags: "الوسوم",
            addTag: "أضف وسم...",
            platform: "المنصة",
            selectPlatform: "اختر المنصة",
            featured: "مميز",
            active: "نشط (مرئي على الموقع)",
            liveUrl: "الرابط المباشر",
            playStoreUrl: "رابط متجر بلاي",
            githubUrl: "رابط GitHub",
            arabicTitle: "العنوان بالعربية",
            arabicDesc: "الوصف بالعربية",
            arabicPlatform: "المنصة بالعربية",
            arabicNote: "اختياري: قدم ترجمة عربية للمشروع.",
            placeholders: {
                title: "مشروعي الرائع",
                slug: "مشروعي-الرائع",
                description: "وصف مختصر للمشروع...",
                imageUrl: "https://example.com/image.jpg أو /local-image.png",
                addTag: "أضف وسم...",
                liveUrl: "https://example.com",
                playStoreUrl: "https://play.google.com/store/apps/...",
                githubUrl: "https://github.com/...",
            },
            tagsLabel: "التقنيات / الوسوم",
            addButton: "إضافة",
        },
        delete: {
            title: "حذف المشروع",
            description: "هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.",
            confirm: "حذف",
            cancel: "إلغاء",
        },
        buttons: {
            edit: "تعديل",
            hide: "إخفاء",
            show: "إظهار",
            view: "عرض",
            delete: "حذف",
        },
        status: {
            active: "نشط",
            inactive: "غير نشط",
            featured: "مميز",
        },
    },
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import Image from "next/image";

interface ProjectFormData {
    slug: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    image: string;
    tags: string[];
    platform: string;
    platformAr: string;
    liveUrl: string;
    playStoreUrl: string;
    githubUrl: string;
    featured: boolean;
    active: boolean;
}

const initialFormData: ProjectFormData = {
    slug: "",
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    image: "",
    tags: [],
    platform: "",
    platformAr: "",
    liveUrl: "",
    playStoreUrl: "",
    githubUrl: "",
    featured: false,
    active: true,
};

const platformOptions = [
    { value: "Website", label: "Website", icon: Globe },
    { value: "Mobile App", label: "Mobile App", icon: Smartphone },
    { value: "Website / Mobile App", label: "Website / Mobile App", icon: Globe },
];

export default function ProjectsPage() {
    const { language, direction } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const projects = useQuery(api.projects.getAll);
    const createProject = useMutation(api.projects.create);
    const updateProject = useMutation(api.projects.update);
    const deleteProject = useMutation(api.projects.remove);
    const toggleActive = useMutation(api.projects.toggleActive);
    const seedProjects = useMutation(api.projects.seedProjects);
    const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
    const getImageUrl = useMutation(api.storage.getImageUrl);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<Id<"projects"> | null>(null);
    const [formData, setFormData] = React.useState<ProjectFormData>(initialFormData);
    const [tagInput, setTagInput] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = React.useState<Id<"projects"> | null>(null);
    const [isSeeding, setIsSeeding] = React.useState(false);
    const [imageInputMode, setImageInputMode] = React.useState<"url" | "upload">("url");
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadStatus, setUploadStatus] = React.useState<"idle" | "success" | "error">("idle");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Allowed image types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            setUploadStatus("error");
            alert("Please select a valid image file (JPG, PNG, WebP, or GIF)");
            setTimeout(() => setUploadStatus("idle"), 3000);
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadStatus("error");
            alert("Image size must be less than 5MB");
            setTimeout(() => setUploadStatus("idle"), 3000);
            return;
        }

        setIsUploading(true);
        setUploadStatus("idle");
        
        try {
            // Step 1: Get upload URL from Convex
            const uploadUrl = await generateUploadUrl();
            
            // Step 2: Upload the file to Convex storage
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            
            if (!result.ok) {
                throw new Error("Failed to upload image to storage");
            }

            const { storageId } = await result.json();
            
            // Step 3: Get the public URL for the uploaded file
            const imageUrl = await getImageUrl({ storageId });
            
            if (!imageUrl) {
                throw new Error("Failed to get image URL");
            }
            
            setFormData(prev => ({ ...prev, image: imageUrl }));
            setUploadStatus("success");
            
            // Reset success status after 3 seconds
            setTimeout(() => setUploadStatus("idle"), 3000);
        } catch (error) {
            console.error("Failed to upload image:", error);
            setUploadStatus("error");
            alert("Failed to upload image. Please try again.");
            setTimeout(() => setUploadStatus("idle"), 3000);
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Seed initial projects handler
    const handleSeedProjects = async () => {
        setIsSeeding(true);
        try {
            await seedProjects({});
        } catch (error) {
            console.error("Failed to seed projects:", error);
        } finally {
            setIsSeeding(false);
        }
    };

    // Reset form when dialog closes
    React.useEffect(() => {
        if (!isDialogOpen) {
            setFormData(initialFormData);
            setEditingProject(null);
            setTagInput("");
            setImageInputMode("url");
            setUploadStatus("idle");
        }
    }, [isDialogOpen]);

    // Load project data when editing
    React.useEffect(() => {
        if (editingProject && projects) {
            const project = projects.find(p => p._id === editingProject);
            if (project) {
                setFormData({
                    slug: project.slug,
                    title: project.title,
                    titleAr: project.titleAr || "",
                    description: project.description,
                    descriptionAr: project.descriptionAr || "",
                    image: project.image,
                    tags: project.tags,
                    platform: project.platform || "",
                    platformAr: project.platformAr || "",
                    liveUrl: project.liveUrl || "",
                    playStoreUrl: project.playStoreUrl || "",
                    githubUrl: project.githubUrl || "",
                    featured: project.featured || false,
                    active: project.active,
                });
            }
        }
    }, [editingProject, projects]);

    const handleOpenCreate = () => {
        setFormData(initialFormData);
        setEditingProject(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (projectId: Id<"projects">) => {
        setEditingProject(projectId);
        setIsDialogOpen(true);
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag]
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleTitleChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            title: value,
            slug: prev.slug || generateSlug(value)
        }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.slug || !formData.description || !formData.image) {
            return;
        }

        setIsSaving(true);
        try {
            if (editingProject) {
                await updateProject({
                    id: editingProject,
                    slug: formData.slug,
                    title: formData.title,
                    titleAr: formData.titleAr || undefined,
                    description: formData.description,
                    descriptionAr: formData.descriptionAr || undefined,
                    image: formData.image,
                    tags: formData.tags,
                    platform: formData.platform || undefined,
                    platformAr: formData.platformAr || undefined,
                    liveUrl: formData.liveUrl || undefined,
                    playStoreUrl: formData.playStoreUrl || undefined,
                    githubUrl: formData.githubUrl || undefined,
                    featured: formData.featured,
                    active: formData.active,
                });
            } else {
                await createProject({
                    slug: formData.slug,
                    title: formData.title,
                    titleAr: formData.titleAr || undefined,
                    description: formData.description,
                    descriptionAr: formData.descriptionAr || undefined,
                    image: formData.image,
                    tags: formData.tags,
                    platform: formData.platform || undefined,
                    platformAr: formData.platformAr || undefined,
                    liveUrl: formData.liveUrl || undefined,
                    playStoreUrl: formData.playStoreUrl || undefined,
                    githubUrl: formData.githubUrl || undefined,
                    featured: formData.featured,
                    active: formData.active,
                });
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save project:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: Id<"projects">) => {
        try {
            await deleteProject({ id });
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const handleToggleActive = async (id: Id<"projects">) => {
        try {
            await toggleActive({ id });
        } catch (error) {
            console.error("Failed to toggle project status:", error);
        }
    };

    if (projects === undefined) {
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
                    {projects.length === 0 && (
                        <Button 
                            onClick={handleSeedProjects} 
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
                        {t.addProject}
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.total}</p>
                        <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.active}</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {projects.filter(p => p.active).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.featured}</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {projects.filter(p => p.featured).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border-gray-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t.stats.inactive}</p>
                        <p className="text-2xl font-bold text-muted-foreground">
                            {projects.filter(p => !p.active).length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Projects List */}
            {projects.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{t.empty.title}</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {t.empty.description}
                        </p>
                        <Button onClick={handleOpenCreate} className="gap-2">
                            <Plus className="w-4 h-4" />
                            {t.empty.button}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {projects.map((project) => (
                        <Card 
                            key={project._id} 
                            className={cn(
                                "transition-all duration-200 hover:shadow-md",
                                !project.active && "opacity-60"
                            )}
                        >
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Image */}
                                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                        {project.featured && (
                                            <div className="absolute top-2 left-2">
                                                <Badge className="bg-yellow-500 text-white gap-1">
                                                    <Star className="w-3 h-3" />
                                                    {t.status.featured}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg text-foreground truncate">
                                                    {language === "ar" && project.titleAr ? project.titleAr : project.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    /{project.slug}
                                                </p>
                                            </div>
                                            <Badge 
                                                variant={project.active ? "default" : "secondary"}
                                                className={cn(
                                                    "shrink-0",
                                                    project.active 
                                                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" 
                                                        : ""
                                                )}
                                            >
                                                {project.active ? t.status.active : t.status.inactive}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {language === "ar" && project.descriptionAr ? project.descriptionAr : project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {project.platform && (
                                                <Badge variant="outline" className="text-xs gap-1">
                                                    {project.platform.includes("Mobile") ? (
                                                        <Smartphone className="w-3 h-3" />
                                                    ) : (
                                                        <Globe className="w-3 h-3" />
                                                    )}
                                                    {language === "ar" && project.platformAr ? project.platformAr : project.platform}
                                                </Badge>
                                            )}
                                            {project.tags.slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {project.tags.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{project.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenEdit(project._id)}
                                                className="gap-1"
                                            >
                                                <Pencil className="w-3 h-3" />
                                                {t.buttons.edit}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggleActive(project._id)}
                                                className="gap-1"
                                            >
                                                {project.active ? (
                                                    <>
                                                        <EyeOff className="w-3 h-3" />
                                                        {t.buttons.hide}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-3 h-3" />
                                                        {t.buttons.show}
                                                    </>
                                                )}
                                            </Button>
                                            {project.liveUrl && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    asChild
                                                    className="gap-1"
                                                >
                                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-3 h-3" />
                                                        {t.buttons.view}
                                                    </a>
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setDeleteConfirmId(project._id)}
                                                className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                {t.buttons.delete}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProject ? t.editProject : t.addProject}
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="basic">{t.form.basicInfo}</TabsTrigger>
                            <TabsTrigger value="links">{t.form.links}</TabsTrigger>
                            <TabsTrigger value="arabic">{t.form.arabic}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">{t.form.title} *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder={t.form.placeholders.title}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">{t.form.slug} *</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                                        placeholder={t.form.placeholders.slug}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t.form.description} *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder={t.form.placeholders.description}
                                    rows={3}
                                />
                            </div>

                            {/* Image Input Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>{t.form.image} *</Label>
                                    <div className="flex gap-1 p-1 bg-muted rounded-lg">
                                        <Button
                                            type="button"
                                            variant={imageInputMode === "url" ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setImageInputMode("url")}
                                            className="gap-1.5 h-7 text-xs"
                                        >
                                            <LinkIcon className="w-3 h-3" />
                                            {t.form.url}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={imageInputMode === "upload" ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setImageInputMode("upload")}
                                            className="gap-1.5 h-7 text-xs"
                                        >
                                            <Upload className="w-3 h-3" />
                                            {t.form.upload}
                                        </Button>
                                    </div>
                                </div>

                                {imageInputMode === "url" ? (
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                        placeholder={t.form.placeholders.imageUrl}
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={cn(
                                                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
                                                "hover:bg-muted/50 hover:border-primary/50",
                                                isUploading && "opacity-50 pointer-events-none",
                                                uploadStatus === "success" && "border-green-500 bg-green-500/10",
                                                uploadStatus === "error" && "border-red-500 bg-red-500/10",
                                                uploadStatus === "idle" && "border-border"
                                            )}
                                        >
                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                    <span className="text-sm text-muted-foreground">Uploading image...</span>
                                                </div>
                                            ) : uploadStatus === "success" ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Upload successful!</span>
                                                    <span className="text-xs text-muted-foreground">Click to upload another</span>
                                                </div>
                                            ) : uploadStatus === "error" ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                                        <X className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">Upload failed</span>
                                                    <span className="text-xs text-muted-foreground">Click to try again</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                                                    <span className="text-xs text-muted-foreground/70">JPG, PNG, WebP, GIF up to 5MB</span>
                                                </div>
                                            )}
                                        </label>
                                        {formData.image && uploadStatus !== "success" && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                Current: {formData.image.includes('convex.cloud') ? 'Uploaded image' : formData.image.split('/').pop()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="platform">{t.form.platform}</Label>
                                <Select
                                    value={formData.platform}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.form.selectPlatform} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {platformOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Image Preview */}
                            {formData.image && (
                                <div className="space-y-2">
                                    <Label>Preview</Label>
                                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted border border-border">
                                        <Image
                                            src={formData.image}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                const errorDiv = document.createElement('div');
                                                errorDiv.className = 'text-center text-muted-foreground';
                                                errorDiv.innerHTML = '<p class="text-sm">Failed to load image</p><p class="text-xs">Check the URL</p>';
                                                target.parentElement?.appendChild(errorDiv);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>{t.form.tagsLabel}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder={t.form.placeholders.addTag}
                                        className="flex-grow"
                                    />
                                    <Button type="button" onClick={handleAddTag} variant="outline">
                                        {t.form.addButton}
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <span className="text-sm">{t.form.featured}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <span className="text-sm">{t.form.active}</span>
                                </label>
                            </div>
                        </TabsContent>

                        <TabsContent value="links" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="liveUrl" className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    {t.form.liveUrl}
                                </Label>
                                <Input
                                    id="liveUrl"
                                    value={formData.liveUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                                    placeholder={t.form.placeholders.liveUrl}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="playStoreUrl" className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    {t.form.playStoreUrl}
                                </Label>
                                <Input
                                    id="playStoreUrl"
                                    value={formData.playStoreUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, playStoreUrl: e.target.value }))}
                                    placeholder={t.form.placeholders.playStoreUrl}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="githubUrl" className="flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" />
                                    {t.form.githubUrl}
                                </Label>
                                <Input
                                    id="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                                    placeholder={t.form.placeholders.githubUrl}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="arabic" className="space-y-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                {t.form.arabicNote}
                            </p>
                            
                            <div className="space-y-2">
                                <Label htmlFor="titleAr">{t.form.arabicTitle}</Label>
                                <Input
                                    id="titleAr"
                                    dir="rtl"
                                    value={formData.titleAr}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                                    placeholder="عنوان المشروع بالعربية"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descriptionAr">{t.form.arabicDesc}</Label>
                                <Textarea
                                    id="descriptionAr"
                                    dir="rtl"
                                    value={formData.descriptionAr}
                                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                                    placeholder="وصف المشروع بالعربية..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="platformAr">Arabic Platform</Label>
                                <Input
                                    id="platformAr"
                                    dir="rtl"
                                    value={formData.platformAr}
                                    onChange={(e) => setFormData(prev => ({ ...prev, platformAr: e.target.value }))}
                                    placeholder="مثال: موقع إلكتروني / تطبيق موبايل"
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
                            disabled={isSaving || !formData.title || !formData.slug || !formData.description || !formData.image}
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
            <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t.delete.title}</DialogTitle>
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
                        >
                            {t.delete.confirm}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
