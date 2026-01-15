import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
  args: {
    title: v.string(),
    imageStorageIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { title, imageStorageIds } = args;

    if (imageStorageIds.length > 5) {
      throw new Error("A daily drop can have at most 5 images.");
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const dropId = await ctx.db.insert("daily_drops", {
      title,
      date,
    });

    await Promise.all(
      imageStorageIds.map((storageId, idx) =>
        ctx.db.insert("images", {
          drop_id: dropId,
          sequence_idx: idx,
          storageId,
          total_tributes: 0,
        }),
      ),
    );

    return dropId;
  },
});

import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

export const giveTribute = mutation({
  args: {
    imageId: v.id("images"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (user.energy < args.amount) {
      throw new Error("Not enough energy");
    }

    if (args.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    // Update image tributes
    const image = await ctx.db.get(args.imageId);
    if (!image) throw new Error("Image not found");

    // Deduct energy
    await ctx.db.patch(userId, {
      energy: user.energy - args.amount,
    });

    await ctx.db.patch(args.imageId, {
      total_tributes: image.total_tributes + args.amount,
    });

    // Record tribute
    await ctx.db.insert("tributes_given", {
      user_id: userId,
      image_id: args.imageId,
      tributes: args.amount,
      timestamp: Date.now(),
    });

    return true;
  },
});

export const getDailyDrop = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const userId = await auth.getUserId(ctx);

    const drop = await ctx.db
      .query("daily_drops")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();

    if (!drop) {
      return null;
    }

    const images = await ctx.db
      .query("images")
      .withIndex("by_drop", (q) => q.eq("drop_id", drop._id))
      .collect();

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => ({
        ...image,
        url: await ctx.storage.getUrl(image.storageId),
      }))
    );

    let userState = null;
    if (userId) {
      const user = await ctx.db.get(userId);
      if (user) {
        const votedImageIds = new Set<Id<"images">>();

        const userTributes = await ctx.db
          .query("tributes_given")
          .withIndex("by_user", q => q.eq("user_id", userId))
          .collect();

        const imagesIds = new Set(images.map(i => i._id));
        const tributes: Record<string, number> = {};
        for (const t of userTributes) {
          if (imagesIds.has(t.image_id)) {
            tributes[t.image_id] = (tributes[t.image_id] || 0) + t.tributes;
          }
        }

        userState = {
          energy: user.energy,
          tributes,
        };
      }
    }

    return {
      ...drop,
      images: imagesWithUrls.sort((a, b) => a.sequence_idx - b.sequence_idx),
      userState,
    };
  },
});