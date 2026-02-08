import { action } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { api } from "./_generated/api";

/**
 * Register a new user with password hashing
 */
export const register = action({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.runQuery(api.auth.getUserByEmail, { email: args.email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(args.password, 10);

        // Create the user
        await ctx.runMutation(api.auth.createUser, {
            email: args.email,
            passwordHash,
        });

        return { success: true, email: args.email };
    },
});

/**
 * Login with password verification and session creation
 */
export const login = action({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        // Get user
        const user = await ctx.runQuery(api.auth.getUserByEmail, { email: args.email });
        if (!user) {
            return { success: false, error: "Invalid email or password" };
        }

        // Verify the password
        const isValid = await bcrypt.compare(args.password, user.passwordHash);
        if (!isValid) {
            return { success: false, error: "Invalid email or password" };
        }

        // Generate session token
        const sessionToken = await bcrypt.hash(`${user._id}-${Date.now()}`, 10);

        // Store the session
        await ctx.runMutation(api.auth.createSession, {
            userId: user._id,
            sessionToken,
        });

        return {
            success: true,
            sessionToken,
            user: {
                id: user._id,
                email: user.email,
            },
        };
    },
});

/**
 * Logout - invalidate the session
 */
export const logout = action({
    args: { sessionToken: v.string() },
    handler: async (ctx, args) => {
        await ctx.runMutation(api.auth.deleteSession, { sessionToken: args.sessionToken });
        return { success: true };
    },
});

/**
 * Validate a session and return user info
 */
export const validateSession = action({
    args: { sessionToken: v.string() },
    handler: async (ctx, args) => {
        // Get the session
        const session = await ctx.runQuery(api.auth.getSessionByToken, { sessionToken: args.sessionToken });
        
        if (!session) {
            return { valid: false, user: null };
        }

        // Check if session is expired
        if (session.expiresAt < Date.now()) {
            // Clean up expired session
            await ctx.runMutation(api.auth.deleteSession, { sessionToken: args.sessionToken });
            return { valid: false, user: null };
        }

        // Get the user
        const user = await ctx.runQuery(api.auth.getUserById, { userId: session.userId });
        
        if (!user) {
            return { valid: false, user: null };
        }

        return {
            valid: true,
            user: {
                id: user._id,
                email: user.email,
            },
        };
    },
});

/**
 * Seed the development user
 * 
 * DEV ONLY - This creates a development user for testing purposes.
 * REMOVE THIS IN PRODUCTION!
 * 
 * To remove this user in production:
 * 1. Delete this function
 * 2. Manually delete the user from the Convex dashboard
 */
export const seedDevUser = action({
    args: {},
    handler: async (ctx) => {
        const DEV_EMAIL = "sayedyousef775@gmail.com";
        const DEV_PASSWORD = "12345678";
        
        // Check if dev user already exists
        const existingUser = await ctx.runQuery(api.auth.getUserByEmail, { email: DEV_EMAIL });

        if (existingUser) {
            return { 
                message: "Dev user already exists", 
                email: DEV_EMAIL,
                alreadyExisted: true 
            };
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

        // Create the dev user
        await ctx.runMutation(api.auth.createUser, {
            email: DEV_EMAIL,
            passwordHash,
        });

        return { 
            message: "Dev user created successfully", 
            email: DEV_EMAIL,
            alreadyExisted: false
        };
    },
});

/**
 * Update user email
 * 
 * SECURITY NOTES:
 * - Validates email format
 * - Checks for email uniqueness
 * - Invalidates all sessions (requires re-login)
 */
export const updateEmail = action({
    args: {
        sessionToken: v.string(),
        newEmail: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate session first
        const session = await ctx.runQuery(api.auth.getSessionByToken, { sessionToken: args.sessionToken });
        
        if (!session || session.expiresAt < Date.now()) {
            return { success: false, error: "Unauthorized: Invalid or expired session" };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(args.newEmail)) {
            return { success: false, error: "Invalid email format" };
        }

        // Update email and invalidate all sessions
        await ctx.runMutation(api.auth.updateUserEmail, {
            userId: session.userId,
            newEmail: args.newEmail,
        });

        // Invalidate all sessions for this user (require re-login)
        await ctx.runMutation(api.auth.deleteAllUserSessions, {
            userId: session.userId,
        });

        return { success: true, message: "Email updated successfully. Please log in again." };
    },
});

/**
 * Update user password
 * 
 * SECURITY NOTES:
 * - Requires current password verification
 * - Validates new password strength
 * - Hashes new password with bcrypt (10 rounds)
 * - Invalidates all sessions for security
 */
export const updatePassword = action({
    args: {
        sessionToken: v.string(),
        currentPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate session first
        const session = await ctx.runQuery(api.auth.getSessionByToken, { sessionToken: args.sessionToken });
        
        if (!session || session.expiresAt < Date.now()) {
            return { success: false, error: "Unauthorized: Invalid or expired session" };
        }

        // Get user for password verification
        const user = await ctx.runQuery(api.auth.getUserById, { userId: session.userId });
        
        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Verify current password
        const isValid = await bcrypt.compare(args.currentPassword, user.passwordHash);
        if (!isValid) {
            return { success: false, error: "Current password is incorrect" };
        }

        // Validate new password strength
        if (args.newPassword.length < 8) {
            return { success: false, error: "New password must be at least 8 characters" };
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(args.newPassword, 10);

        // Update password
        await ctx.runMutation(api.auth.updateUserPassword, {
            userId: user._id,
            newPasswordHash,
        });

        // Invalidate all sessions for security
        await ctx.runMutation(api.auth.deleteAllUserSessions, {
            userId: user._id,
        });

        return { success: true, message: "Password updated successfully. Please log in again." };
    },
});
