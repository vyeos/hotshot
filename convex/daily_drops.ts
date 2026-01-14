import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
                })
            )
        );

        return dropId;
    },
});
