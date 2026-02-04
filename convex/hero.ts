import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get hero settings
export const getSettings = query({
    args: {},
    handler: async (ctx) => {
        const settings = await ctx.db.query("heroSettings").first();
        return settings;
    },
});

// Update hero settings
export const updateSettings = mutation({
    args: {
        heroImage: v.optional(v.string()),
        heroImageType: v.optional(v.string()),
        headlineEn: v.optional(v.string()),
        headlineAr: v.optional(v.string()),
        subheadlineEn: v.optional(v.string()),
        subheadlineAr: v.optional(v.string()),
        badgeEn: v.optional(v.string()),
        badgeAr: v.optional(v.string()),
        titleEn: v.optional(v.string()),
        titleAr: v.optional(v.string()),
        bioEn: v.optional(v.string()),
        bioAr: v.optional(v.string()),
        resumeUrl: v.optional(v.string()),
        resumeType: v.optional(v.string()),
        yearsExperience: v.optional(v.string()),
        projectsCompleted: v.optional(v.string()),
        contactBtnEn: v.optional(v.string()),
        contactBtnAr: v.optional(v.string()),
        downloadBtnEn: v.optional(v.string()),
        downloadBtnAr: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("heroSettings").first();
        
        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            return await ctx.db.insert("heroSettings", {
                ...args,
                updatedAt: Date.now(),
            });
        }
    },
});

// Update specific field
export const updateField = mutation({
    args: {
        field: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("heroSettings").first();
        
        const updateData: Record<string, unknown> = {
            [args.field]: args.value,
            updatedAt: Date.now(),
        };
        
        if (existing) {
            await ctx.db.patch(existing._id, updateData);
            return existing._id;
        } else {
            return await ctx.db.insert("heroSettings", {
                ...updateData,
                updatedAt: Date.now(),
            } as {
                heroImage?: string;
                heroImageType?: string;
                headlineEn?: string;
                headlineAr?: string;
                subheadlineEn?: string;
                subheadlineAr?: string;
                badgeEn?: string;
                badgeAr?: string;
                titleEn?: string;
                titleAr?: string;
                bioEn?: string;
                bioAr?: string;
                resumeUrl?: string;
                resumeType?: string;
                yearsExperience?: string;
                projectsCompleted?: string;
                contactBtnEn?: string;
                contactBtnAr?: string;
                downloadBtnEn?: string;
                downloadBtnAr?: string;
                updatedAt: number;
            });
        }
    },
});

// Seed hero settings with default values
export const seedHeroSettings = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("heroSettings").first();
        
        if (existing) {
            return { message: "Hero settings already exist", id: existing._id };
        }
        
        const defaultSettings = {
            heroImage: "/my-image-without-background.png",
            heroImageType: "url",
            headlineEn: "Crafting Digital High-End Solutions",
            headlineAr: "أصنع تجارب رقمية متكاملة",
            subheadlineEn: "Passionate Software Engineer with experience in building scalable web applications using modern technologies.",
            subheadlineAr: "مهندس برمجيات شغوف بخبرة في بناء تطبيقات الويب القابلة للتطوير باستخدام التقنيات الحديثة.",
            badgeEn: "Available for freelance work",
            badgeAr: "متاح للعمل الحر",
            titleEn: "Software Engineer",
            titleAr: "مهندس برمجيات",
            bioEn: "Passionate Software Engineer with experience in building scalable web applications using modern technologies.",
            bioAr: "مهندس برمجيات شغوف بخبرة في بناء تطبيقات الويب القابلة للتطوير باستخدام التقنيات الحديثة.",
            resumeUrl: "/Youssef_Sayed_Backend.pdf",
            resumeType: "url",
            yearsExperience: "5+",
            projectsCompleted: "50+",
            contactBtnEn: "Contact Me",
            contactBtnAr: "تواصل معي",
            downloadBtnEn: "Download CV",
            downloadBtnAr: "تحميل السيرة الذاتية",
            updatedAt: Date.now(),
        };
        
        const id = await ctx.db.insert("heroSettings", defaultSettings);
        return { message: "Hero settings created with defaults", id };
    },
});
