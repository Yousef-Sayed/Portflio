import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

// ============ PUBLIC QUERIES ============

/**
 * Get user by email
 */
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .first();
    },
});

/**
 * Get session by token
 */
export const getSessionByToken = query({
    args: { sessionToken: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("sessions")
            .withIndex("token", (q) => q.eq("sessionToken", args.sessionToken))
            .first();
    },
});

/**
 * Get user by ID (for session validation)
 */
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// ============ PUBLIC MUTATIONS ============

/**
 * Create a user
 */
export const createUser = mutation({
    args: {
        email: v.string(),
        passwordHash: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            email: args.email,
            passwordHash: args.passwordHash,
            createdAt: Date.now(),
        });
    },
});

/**
 * Create a session
 */
export const createSession = mutation({
    args: {
        userId: v.id("users"),
        sessionToken: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("sessions", {
            userId: args.userId,
            sessionToken: args.sessionToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    },
});

/**
 * Delete a session
 */
export const deleteSession = mutation({
    args: { sessionToken: v.string() },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query("sessions")
            .filter((q) => q.eq(q.field("sessionToken"), args.sessionToken))
            .first();

        if (session) {
            await ctx.db.delete(session._id);
        }
    },
});

/**
 * Delete all sessions for a user (for security - invalidate all sessions)
 */
export const deleteAllUserSessions = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const sessions = await ctx.db
            .query("sessions")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        for (const session of sessions) {
            await ctx.db.delete(session._id);
        }
    },
});

/**
 * Update user email
 */
export const updateUserEmail = mutation({
    args: { 
        userId: v.id("users"),
        newEmail: v.string()
    },
    handler: async (ctx, args) => {
        // Check if email is already taken by another user
        const existingUser = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.newEmail))
            .first();

        if (existingUser && existingUser._id.toString() !== args.userId.toString()) {
            throw new Error("Email already in use");
        }

        await ctx.db.patch(args.userId, {
            email: args.newEmail,
        });
    },
});

/**
 * Update user password
 */
export const updateUserPassword = mutation({
    args: { 
        userId: v.id("users"),
        newPasswordHash: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            passwordHash: args.newPasswordHash,
        });
    },
});

// ============ ACTIONS (separate file to avoid circular types) ============

// Note: Actions that call other functions are in authActions.ts
// This file contains only queries and mutations that don't call other functions
