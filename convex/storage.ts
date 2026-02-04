import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a URL for uploading a file
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

// Get the URL for a stored file by storage ID string
export const getUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

// Get URL from storage ID - returns the URL immediately after upload
export const getImageUrl = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        const url = await ctx.storage.getUrl(args.storageId);
        return url;
    },
});

// Delete a stored file
export const deleteFile = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.delete(args.storageId);
    },
});
