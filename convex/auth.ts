import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { createNewUserUtil } from "./utils";

export const signUp = mutation({
  args: {
    username: v.string(),
    shouldHash: v.boolean(),
    password: v.string(),
    confirm: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existing) {
      throw new Error("Username already taken");
    }

    const newUserDoc = createNewUserUtil({
      username: args.username,
      password: args.password,
      shouldHash: args.shouldHash,
    });
    const newUserId = await ctx.db.insert("users", newUserDoc);
    return await ctx.db.get(newUserId);
  },
});

export const login = query({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) return null;

    if (user.password !== args.password) return null;

    return user;
  },
});
