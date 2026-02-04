import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            name: args.name,
            email: args.email,
            message: args.message,
            createdAt: Date.now(),
        });
    },
});

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db
            .query("messages")
            .collect();
        
        // Sort by createdAt descending (newest first)
        return messages.sort((a, b) => b.createdAt - a.createdAt);
    },
});

export const getById = query({
    args: { id: v.id("messages") },
    handler: async (ctx, args) => {
        const message = await ctx.db.get(args.id);
        return message;
    },
});

// Settings functions
export const getSetting = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const setting = await ctx.db
            .query("settings")
            .filter((q) => q.eq(q.field("key"), args.key))
            .first();
        return setting?.value;
    },
});

export const setSetting = mutation({
    args: { key: v.string(), value: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("settings")
            .filter((q) => q.eq(q.field("key"), args.key))
            .first();
        
        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("settings", { key: args.key, value: args.value });
        }
    },
});
