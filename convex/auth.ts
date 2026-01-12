import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexError, v } from "convex/values";
import bcrypt from "bcryptjs";
import { Doc } from "./_generated/dataModel";

export const signUp = action({
  args: {
    username: v.string(),
    shouldHash: v.boolean(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const taken = await ctx.runQuery(internal.users.getUserByUsername, {
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

export const login = action({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const user = await ctx.runQuery(internal.users.getUserByUsername, {
      username: args.username,
    });

    const GENERIC_ERROR = "Invalid username or password";

    if (!user) throw new ConvexError(GENERIC_ERROR);

    if (user.shouldHash) {
      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) throw new ConvexError(GENERIC_ERROR);
    } else {
      if (user.password !== args.password) throw new ConvexError(GENERIC_ERROR);
    }

    return user;
  },
});
