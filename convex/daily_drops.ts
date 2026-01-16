import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
  args: {
    title: v.string(),
    imageStorageIds: v.array(v.string()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { title, imageStorageIds, date } = args;

    if (imageStorageIds.length > 5) {
      throw new Error("A daily drop can have at most 5 images.");
    }

    const dropDate = date || new Date().toISOString().split("T")[0]; // Use provided date or today

    const dropId = await ctx.db.insert("daily_drops", {
      title,
      date: dropDate,
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

export const update = mutation({
  args: {
    dropId: v.id("daily_drops"),
    title: v.string(),
    date: v.string(),
    imageStorageIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { dropId, title, date, imageStorageIds } = args;

    await ctx.db.patch(dropId, {
      title,
      date,
    });

    if (imageStorageIds) {
      if (imageStorageIds.length > 5) {
        throw new Error("A daily drop can have at most 5 images.");
      }

      const existingImages = await ctx.db
        .query("images")
        .withIndex("by_drop", (q) => q.eq("drop_id", dropId))
        .collect();

      await Promise.all(existingImages.map(img => ctx.db.delete(img._id)));

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
    }
  }
});

import { auth } from "./auth";

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

    if ((user.energy ?? 20) < args.amount) {
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
      energy: (user.energy ?? 20) - args.amount,
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
      .withIndex("by_date", (q) => q.lte("date", today))
      .order("desc")
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
      })),
    );

    let userState = null;
    if (userId) {
      const user = await ctx.db.get(userId);
      if (user) {

        const userTributes = await ctx.db
          .query("tributes_given")
          .withIndex("by_user", (q) => q.eq("user_id", userId))
          .collect();

        const imagesIds = new Set(images.map((i) => i._id));
        const tributes: Record<string, number> = {};
        for (const t of userTributes) {
          if (imagesIds.has(t.image_id)) {
            tributes[t.image_id] = (tributes[t.image_id] || 0) + t.tributes;
          }
        }

        userState = {
          energy: user.energy ?? 20,
          tributes,
        };
      }
    }

    return {
      ...drop,
      images: imagesWithUrls.sort((a, b) => a.sequence_idx - b.sequence_idx),
      userState,
      isUpcoming: false,
    };
  },
});

export const getUpcomingDrops = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    const drops = await ctx.db
      .query("daily_drops")
      .withIndex("by_date", (q) => q.gt("date", today))
      .collect();

    const dropsWithImages = await Promise.all(
      drops.map(async (drop) => {
        const images = await ctx.db
          .query("images")
          .withIndex("by_drop", (q) => q.eq("drop_id", drop._id))
          .collect();

        const imagesWithUrls = await Promise.all(
          images.map(async (image) => ({
            ...image,
            url: await ctx.storage.getUrl(image.storageId),
          })),
        );

        return {
          ...drop,
          images: imagesWithUrls.sort(
            (a, b) => a.sequence_idx - b.sequence_idx,
          ),
          isUpcoming: true,
        };
      }),
    );

    return dropsWithImages.sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getVault = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    const drops = await ctx.db
      .query("daily_drops")
      .withIndex("by_date")
      .order("desc")
      .take(8);

    const pastDrops = drops.filter((d) => d.date < today);

    const dropsWithImages = await Promise.all(
      pastDrops.map(async (drop) => {
        const images = await ctx.db
          .query("images")
          .withIndex("by_drop", (q) => q.eq("drop_id", drop._id))
          .collect();

        const imagesWithUrls = await Promise.all(
          images.map(async (image) => ({
            ...image,
            url: await ctx.storage.getUrl(image.storageId),
          })),
        );

        const totalDropTributes = images.reduce(
          (sum, img) => sum + img.total_tributes,
          0,
        );

        const winner =
          imagesWithUrls.length > 0
            ? imagesWithUrls.reduce((prev, current) =>
              prev.total_tributes > current.total_tributes ? prev : current,
            )
            : null;

        return {
          ...drop,
          images: imagesWithUrls.sort(
            (a, b) => a.sequence_idx - b.sequence_idx,
          ),
          winner,
          totalDropTributes,
        };
      }),
    );

    return dropsWithImages;
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

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
      })),
    );

    const sortedImages = imagesWithUrls.sort(
      (a, b) => b.total_tributes - a.total_tributes,
    );

    return {
      ...drop,
      images: sortedImages,
    };
  },
});