import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
        name: v.string(),
        email: v.string(),
        message: v.string(),
        createdAt: v.number(),
    }),
    settings: defineTable({
        key: v.string(),
        value: v.string(),
    }),
    heroSettings: defineTable({
        // Hero image - can be URL or storage ID
        heroImage: v.optional(v.string()),
        heroImageType: v.optional(v.string()), // "url" or "upload"
        // Headlines
        headlineEn: v.optional(v.string()),
        headlineAr: v.optional(v.string()),
        // Subheadlines / taglines
        subheadlineEn: v.optional(v.string()),
        subheadlineAr: v.optional(v.string()),
        // Badge text
        badgeEn: v.optional(v.string()),
        badgeAr: v.optional(v.string()),
        // Title (role)
        titleEn: v.optional(v.string()),
        titleAr: v.optional(v.string()),
        // Bio
        bioEn: v.optional(v.string()),
        bioAr: v.optional(v.string()),
        // CV/Resume
        resumeUrl: v.optional(v.string()),
        resumeType: v.optional(v.string()), // "url" or "upload"
        // Stats
        yearsExperience: v.optional(v.string()),
        projectsCompleted: v.optional(v.string()),
        // Button labels
        contactBtnEn: v.optional(v.string()),
        contactBtnAr: v.optional(v.string()),
        downloadBtnEn: v.optional(v.string()),
        downloadBtnAr: v.optional(v.string()),
        // Metadata
        updatedAt: v.number(),
    }),
    projects: defineTable({
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
        order: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),
    skills: defineTable({
        name: v.string(),
        nameAr: v.optional(v.string()),
        category: v.string(), // "frontend" or "backend"
        level: v.number(), // 0-100
        active: v.boolean(),
        order: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),
    experience: defineTable({
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
        order: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),
});
