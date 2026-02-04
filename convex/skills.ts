import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all skills (for dashboard)
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const skills = await ctx.db.query("skills").collect();
        return skills.sort((a, b) => {
            // Sort by category first, then by order
            if (a.category !== b.category) {
                return a.category === "frontend" ? -1 : 1;
            }
            return a.order - b.order;
        });
    },
});

// Get active skills only (for public display)
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        const skills = await ctx.db
            .query("skills")
            .filter((q) => q.eq(q.field("active"), true))
            .collect();
        return skills.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category === "frontend" ? -1 : 1;
            }
            return a.order - b.order;
        });
    },
});

// Get skills by category
export const getByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        const skills = await ctx.db
            .query("skills")
            .filter((q) => 
                q.and(
                    q.eq(q.field("category"), args.category),
                    q.eq(q.field("active"), true)
                )
            )
            .collect();
        return skills.sort((a, b) => a.order - b.order);
    },
});

// Create a new skill
export const create = mutation({
    args: {
        name: v.string(),
        nameAr: v.optional(v.string()),
        category: v.string(),
        level: v.number(),
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        const skills = await ctx.db
            .query("skills")
            .filter((q) => q.eq(q.field("category"), args.category))
            .collect();
        const maxOrder = skills.length > 0 
            ? Math.max(...skills.map(s => s.order)) 
            : -1;
        
        const now = Date.now();
        return await ctx.db.insert("skills", {
            ...args,
            order: maxOrder + 1,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing skill
export const update = mutation({
    args: {
        id: v.id("skills"),
        name: v.optional(v.string()),
        nameAr: v.optional(v.string()),
        category: v.optional(v.string()),
        level: v.optional(v.number()),
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

// Delete a skill
export const remove = mutation({
    args: { id: v.id("skills") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Toggle skill active status
export const toggleActive = mutation({
    args: { id: v.id("skills") },
    handler: async (ctx, args) => {
        const skill = await ctx.db.get(args.id);
        if (!skill) throw new Error("Skill not found");
        
        await ctx.db.patch(args.id, {
            active: !skill.active,
            updatedAt: Date.now(),
        });
    },
});

// Seed initial skills from static data
export const seedSkills = mutation({
    args: {},
    handler: async (ctx) => {
        const existingSkills = await ctx.db.query("skills").collect();
        if (existingSkills.length > 0) {
            return { message: "Skills already exist. Skipping seed.", count: existingSkills.length };
        }

        const now = Date.now();
        
        const frontendSkills = [
            { name: "HTML / CSS", level: 95 },
            { name: "JavaScript / TypeScript", level: 90 },
            { name: "React / Next.js", level: 95 },
            { name: "Tailwind CSS", level: 95 },
            { name: "Bootstrap", level: 85 },
            { name: "jQuery", level: 80 },
        ];

        const backendSkills = [
            { name: "PHP / Laravel", level: 90 },
            { name: "Python", level: 85 },
            { name: "Node.js / Express", level: 85 },
            { name: "SQL / Database", level: 85 },
        ];

        let order = 0;
        for (const skill of frontendSkills) {
            await ctx.db.insert("skills", {
                name: skill.name,
                category: "frontend",
                level: skill.level,
                active: true,
                order: order++,
                createdAt: now,
                updatedAt: now,
            });
        }

        order = 0;
        for (const skill of backendSkills) {
            await ctx.db.insert("skills", {
                name: skill.name,
                category: "backend",
                level: skill.level,
                active: true,
                order: order++,
                createdAt: now,
                updatedAt: now,
            });
        }

        return { message: "Successfully seeded skills", count: frontendSkills.length + backendSkills.length };
    },
});
