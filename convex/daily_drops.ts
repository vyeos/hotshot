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

    if (imageStorageIds.length === 0 || imageStorageIds.length > 5) {
      throw new Error("A daily drop must have between 1 and 5 images.");
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

export const getDailyDrop = query({
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
      }))
    );

    return {
      ...drop,
      images: imagesWithUrls.sort((a, b) => a.sequence_idx - b.sequence_idx),
    };
  },
});
