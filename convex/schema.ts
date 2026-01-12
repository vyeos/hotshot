import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    password: v.string(),
    daily_allowance: v.int64(),
    balance: v.int64(),
    isVirgin: v.boolean(),
  }).index("by_username", ["username"]),

  daily_drops: defineTable({
    title: v.string(),
    date: v.string(),
  }).index("by_date", ["date"]),

  images: defineTable({
    drop_id: v.id("daily_drops"),
    sequence_idx: v.int64(),
    url: v.string(),
    total_votes: v.int64(),
  })
    .index("by_drop", ["drop_id"])
    .index("by_drop_and_score", ["drop_id", "total_votes"]),

  votes_transactions: defineTable({
    user_id: v.id("users"),
    image_id: v.id("images"),
    amount: v.int64(),
    timestamp: v.int64(),
  })
    .index("by_image", ["image_id"])
    .index("by_user", ["user_id"]),
});
