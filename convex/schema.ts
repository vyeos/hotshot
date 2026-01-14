import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    username: v.optional(v.string()),
    daily_allowance: v.optional(v.number()),
    energy: v.optional(v.number()),
    isVirgin: v.optional(v.boolean()),
  })
    .index("by_username", ["username"])
    .index("email", ["email"]),

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

  tributes_given: defineTable({
    user_id: v.id("users"),
    image_id: v.id("images"),
    tributes: v.number(),
    timestamp: v.number(),
  })
    .index("by_image", ["image_id"])
    .index("by_user", ["user_id"]),
});

export default schema;
