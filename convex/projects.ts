import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all projects (for dashboard)
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db.query("projects").collect();
        return projects.sort((a, b) => a.order - b.order);
    },
});

// Get active projects only (for public display)
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db
            .query("projects")
            .filter((q) => q.eq(q.field("active"), true))
            .collect();
        return projects.sort((a, b) => a.order - b.order);
    },
});

// Get a single project by slug
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const project = await ctx.db
            .query("projects")
            .filter((q) => q.eq(q.field("slug"), args.slug))
            .first();
        return project;
    },
});

// Get a single project by ID
export const getById = query({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new project
export const create = mutation({
    args: {
        slug: v.string(),
        title: v.string(),
        titleAr: v.optional(v.string()),
        description: v.string(),
        descriptionAr: v.optional(v.string()),
        image: v.string(),
        tags: v.array(v.string()),
        platform: v.optional(v.string()),
        platformAr: v.optional(v.string()),
        liveUrl: v.optional(v.string()),
        playStoreUrl: v.optional(v.string()),
        githubUrl: v.optional(v.string()),
        featured: v.optional(v.boolean()),
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Get the highest order number
        const projects = await ctx.db.query("projects").collect();
        const maxOrder = projects.length > 0 
            ? Math.max(...projects.map(p => p.order)) 
            : -1;
        
        const now = Date.now();
        return await ctx.db.insert("projects", {
            ...args,
            order: maxOrder + 1,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing project
export const update = mutation({
    args: {
        id: v.id("projects"),
        slug: v.optional(v.string()),
        title: v.optional(v.string()),
        titleAr: v.optional(v.string()),
        description: v.optional(v.string()),
        descriptionAr: v.optional(v.string()),
        image: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        platform: v.optional(v.string()),
        platformAr: v.optional(v.string()),
        liveUrl: v.optional(v.string()),
        playStoreUrl: v.optional(v.string()),
        githubUrl: v.optional(v.string()),
        featured: v.optional(v.boolean()),
        active: v.optional(v.boolean()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );
        
        await ctx.db.patch(id, {
            ...filteredUpdates,
            updatedAt: Date.now(),
        });
    },
});

// Delete a project
export const remove = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Toggle project active status
export const toggleActive = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.id);
        if (!project) throw new Error("Project not found");
        
        await ctx.db.patch(args.id, {
            active: !project.active,
            updatedAt: Date.now(),
        });
    },
});

// Reorder projects
export const reorder = mutation({
    args: {
        projectIds: v.array(v.id("projects")),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        for (let i = 0; i < args.projectIds.length; i++) {
            await ctx.db.patch(args.projectIds[i], {
                order: i,
                updatedAt: now,
            });
        }
    },
});

// Seed initial projects from static data
export const seedProjects = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if projects already exist
        const existingProjects = await ctx.db.query("projects").collect();
        if (existingProjects.length > 0) {
            return { message: "Projects already exist. Skipping seed.", count: existingProjects.length };
        }

        const now = Date.now();
        
        const initialProjects = [
            {
                slug: "henta",
                title: "Henta",
                titleAr: "Henta",
                platform: "Mobile App",
                platformAr: "تطبيق موبايل",
                description: "A professional mobile application for book management allowing users to browse, purchase, and organize collections. Features a multi-auth system and secure payment integration.",
                descriptionAr: "تطبيق موبايل احترافي لإدارة الكتب يتيح للمستخدمين تصفح وشراء وتنظيم مجموعاتهم الخاصة. يتميز بنظام مصادقة متعدد الأدوار ونظام دفع آمن متكامل.",
                image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
                tags: ["Laravel", "PHP", "MySQL", "jQuery", "Bootstrap"],
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.apphentaa.evyx&pcampaignid=web_share",
                featured: true,
                active: true,
                order: 0,
            },
            {
                slug: "egy-pin",
                title: "EGY-PIN",
                titleAr: "EGY-PIN",
                platform: "Website / Mobile App",
                platformAr: "موقع إلكتروني / تطبيق موبايل",
                description: "A comprehensive platform for exploring tourist attractions across Egypt. Supports paid subscriptions for spot listings and interactive mapping via Google Maps API.",
                descriptionAr: "منصة شاملة لاستكشاف المعالم السياحية في جميع أنحاء مصر. تدعم الاشتراكات المدفوعة لإدراج الأماكن وخدمة خرائط تفاعلية عبر Google Maps API.",
                image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80",
                tags: ["Laravel", "PHP", "Laravel Nova", "MySQL", "Google Maps"],
                liveUrl: "https://egy-pin.com/",
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.egypin.evyx&pcampaignid=web_share",
                featured: true,
                active: true,
                order: 1,
            },
            {
                slug: "caeser",
                title: "Caeser",
                titleAr: "Caeser",
                platform: "Mobile App",
                platformAr: "تطبيق موبايل",
                description: "Specialized marketplace for car spare parts. Features point rewards, location-based branch discovery, and roadside assistance services with full bilingual support.",
                descriptionAr: "متجر متخصص لقطع غيار السيارات. يتميز بنظام نقاط ومكافآت، واكتشاف الفروع القريبة بناءً على الموقع، وخدمات إنقاذ الطرق مع دعم كامل للغتين.",
                image: "/caeser.svg",
                tags: ["Laravel", "PHP", "Laravel Nova", "Mobile API"],
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.ceaser.evyx&pcampaignid=web_share",
                featured: true,
                active: true,
                order: 2,
            },
            {
                slug: "maxliss",
                title: "Maxliss",
                titleAr: "Maxliss",
                platform: "Website / Mobile App",
                platformAr: "موقع إلكتروني / تطبيق موبايل",
                description: "Advanced booking platform for hair treatment specialists. Includes specialist tracking for safety, salon reservations, live chat, and SOS emergency features.",
                descriptionAr: "منصة حجز متطورة لخبراء علاج الشعر. تتضمن تتبع المتخصصين لضمان السلامة، وحجز الصالونات، والدردشة المباشرة، وميزات طوارئ SOS.",
                image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
                tags: ["Laravel", "PHP", "WebSocket", "Real-time Tracking"],
                liveUrl: "https://maxliss.evyx.lol/",
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.maxliss.evyx&pcampaignid=web_share",
                featured: true,
                active: true,
                order: 3,
            },
            {
                slug: "hesperdes",
                title: "Hesperdes",
                titleAr: "Hesperdes",
                platform: "Website",
                platformAr: "موقع إلكتروني",
                description: "University management system featuring a React frontend and Laravel backend. Includes a flexible CMS and a robust admin dashboard for academic administration.",
                descriptionAr: "نظام إدارة جامعي يتميز بواجهة React وخلفية Laravel. يتضمن نظاماً مرناً لإدارة المحتوى ولوحة تحكم قوية للإدارة الأكاديمية.",
                image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
                tags: ["React", "Laravel", "PHP", "Laravel Nova", "API"],
                liveUrl: "https://hesperides-website.vercel.app/",
                featured: true,
                active: true,
                order: 4,
            },
            {
                slug: "al-omar",
                title: "Al-Omar Law Firm",
                titleAr: "مكتب العمر للمحاماة",
                platform: "Website",
                platformAr: "موقع إلكتروني",
                description: "Official web presence for a prestigious law firm, designed with a professional legal aesthetic and structured content optimized for legal practitioners.",
                descriptionAr: "الموقع الرسمي لمكتب محاماة مرموق، مصمم بجمالية قانونية احترافية ومحتوى منظم مخصص للممارسين القانونيين.",
                image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
                tags: ["Professional UI", "Responsive", "Law Firm"],
                liveUrl: "https://www.alomarlaw.com/",
                featured: true,
                active: true,
                order: 5,
            },
        ];

        // Insert all projects
        for (const project of initialProjects) {
            await ctx.db.insert("projects", {
                ...project,
                createdAt: now,
                updatedAt: now,
            });
        }

        return { message: "Successfully seeded projects", count: initialProjects.length };
    },
});
