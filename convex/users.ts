import { v } from "convex/values";
import { auth } from "./auth";
import { query, mutation } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return {
      ...user,
      daily_allowance: user.daily_allowance ?? 20,
      energy: user.energy ?? 20,
    };
  },
});

export const isUsernameTaken = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    return !!user;
  },
});

export const getUserEmailByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    return user?.email;
  },
});

export const setUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existing && existing._id !== userId) {
      throw new Error("Username taken");
    }

    await ctx.db.patch(userId, { username: args.username });
  },
});

export const checkEnergyRefill = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return;

    const user = await ctx.db.get(userId);
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    if (user.lastRefillDate !== today) {
      const dailyAllowance = user.daily_allowance ?? 20;
      const currentEnergy = user.energy ?? 0;

      await ctx.db.patch(userId, {
        energy: currentEnergy + dailyAllowance,
        lastRefillDate: today,
        daily_allowance: dailyAllowance,
      });
    }
  }
});