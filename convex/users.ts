import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { createNewUserUtil } from "./utils";

export const getUser = query({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user || user.password !== args.password) {
      return null;
    }

    return user;
  },
});

export const createUser = mutation({
  args: { username: v.string(), password: v.string(), shouldHash: v.boolean() },
  handler: async (ctx, args) => {
    const newUserDoc = createNewUserUtil({
      username: args.username,
      password: args.password,
      shouldHash: args.shouldHash,
    });
    const newUserId = await ctx.db.insert("users", newUserDoc);
    const newUser = await ctx.db.get(newUserId);
    return newUser;
  },
});
