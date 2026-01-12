import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const checkUsername = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
  },
});

export const createUser = internalMutation({
  args: {
    username: v.string(),
    password: v.string(),
    shouldHash: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existing) {
      throw new Error("Username already taken");
    }

    const newUserId = await ctx.db.insert("users", {
      username: args.username,
      password: args.password,
      shouldHash: args.shouldHash,
      daily_allowance: 20,
      energy: 20,
      isVirgin: false,
    });
    return await ctx.db.get(newUserId);
  },
});
