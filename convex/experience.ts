import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all experience (for dashboard)
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const experience = await ctx.db.query("experience").collect();
        return experience.sort((a, b) => a.order - b.order);
    },
});

// Get active experience only (for public display)
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        const experience = await ctx.db
            .query("experience")
            .filter((q) => q.eq(q.field("active"), true))
            .collect();
        return experience.sort((a, b) => a.order - b.order);
    },
});

// Get a single experience by ID
export const getById = query({
    args: { id: v.id("experience") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new experience
export const create = mutation({
    args: {
        role: v.string(),
        roleAr: v.optional(v.string()),
        company: v.string(),
        companyAr: v.optional(v.string()),
        period: v.string(),
        periodAr: v.optional(v.string()),
        description: v.string(),
        descriptionAr: v.optional(v.string()),
        current: v.optional(v.boolean()),
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        const experience = await ctx.db.query("experience").collect();
        const maxOrder = experience.length > 0 
            ? Math.max(...experience.map(e => e.order)) 
            : -1;
        
        const now = Date.now();
        return await ctx.db.insert("experience", {
            ...args,
            order: maxOrder + 1,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing experience
export const update = mutation({
    args: {
        id: v.id("experience"),
        role: v.optional(v.string()),
        roleAr: v.optional(v.string()),
        company: v.optional(v.string()),
        companyAr: v.optional(v.string()),
        period: v.optional(v.string()),
        periodAr: v.optional(v.string()),
        description: v.optional(v.string()),
        descriptionAr: v.optional(v.string()),
        current: v.optional(v.boolean()),
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

// Delete an experience
export const remove = mutation({
    args: { id: v.id("experience") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Toggle experience active status
export const toggleActive = mutation({
    args: { id: v.id("experience") },
    handler: async (ctx, args) => {
        const experience = await ctx.db.get(args.id);
        if (!experience) throw new Error("Experience not found");
        
        await ctx.db.patch(args.id, {
            active: !experience.active,
            updatedAt: Date.now(),
        });
    },
});

// Seed initial experience from static data
export const seedExperience = mutation({
    args: {},
    handler: async (ctx) => {
        const existingExperience = await ctx.db.query("experience").collect();
        if (existingExperience.length > 0) {
            return { message: "Experience already exist. Skipping seed.", count: existingExperience.length };
        }

        const now = Date.now();
        
        const initialExperience = [
            {
                role: "Technical Lead / Technical Responsible",
                roleAr: "قائد تقني / المسئول التقني",
                company: "Al-Omar Law Firm",
                companyAr: "مكتب العمر للمحاماة",
                period: "March 2025 - Present",
                periodAr: "مارس 2025 - الآن",
                description: "Leading the technical strategy and development for a prestigious law firm, overseeing system architecture and digital transformation.",
                descriptionAr: "قيادة الاستراتيجية التقنية والتطوير لمكتب محاماة مرموق، والإشراف على بنية الأنظمة والتحول الرقمي.",
                current: true,
                active: true,
                order: 0,
            },
            {
                role: "Full-Stack Developer",
                roleAr: "مطور ويب شامل (Full-Stack)",
                company: "Evyx",
                companyAr: "Evyx",
                period: "July 2024",
                periodAr: "يوليو 2024",
                description: "Developed and maintained full-stack applications with a focus on performance, scalability, and modern user experiences.",
                descriptionAr: "تطوير وصيانة تطبيقات الويب المتكاملة مع التركيز على الأداء والقابلية للتوسع وتجارب المستخدم الحديثة.",
                current: false,
                active: true,
                order: 1,
            },
        ];

        for (const exp of initialExperience) {
            await ctx.db.insert("experience", {
                ...exp,
                createdAt: now,
                updatedAt: now,
            });
        }

        return { message: "Successfully seeded experience", count: initialExperience.length };
    },
});
