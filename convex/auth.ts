import { query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { Doc } from "./_generated/dataModel";

export const signUp = action({
  args: {
    username: v.string(),
    shouldHash: v.boolean(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const taken = await ctx.runQuery(internal.users.checkUsername, {
      username: args.username,
    });
    if (taken) throw new Error("Username already taken");

    let finalPassword = args.password;
    if (args.shouldHash) {
      const salt = await bcrypt.genSalt(10);
      finalPassword = await bcrypt.hash(args.password, salt);
    }

    const user = await ctx.runMutation(internal.users.createUser, {
      username: args.username,
      password: finalPassword,
      shouldHash: args.shouldHash,
    });

    return user;
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
