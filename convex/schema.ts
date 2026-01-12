import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    password: v.string(),
    shouldHash: v.boolean(),
    daily_allowance: v.number(),
    energy: v.number(),
    isVirgin: v.boolean(),
  }).index("by_username", ["username"]),

  daily_drops: defineTable({
    title: v.string(),
    date: v.string(),
  }).index("by_date", ["date"]),

  images: defineTable({
    drop_id: v.id("daily_drops"),
    sequence_idx: v.number(),
    url: v.string(),
    total_tributes: v.number(),
  })
    .index("by_drop", ["drop_id"])
    .index("by_drop_and_score", ["drop_id", "total_tributes"]),

  enery_transactions: defineTable({
    user_id: v.id("users"),
    image_id: v.id("images"),
    tributes: v.number(),
    timestamp: v.number(),
  })
    .index("by_image", ["image_id"])
    .index("by_user", ["user_id"]),
});
