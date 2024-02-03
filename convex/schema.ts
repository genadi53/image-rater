import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    title: v.string(),
    userId: v.id("users"),
    imageA: v.string(),
    votesA: v.number(),
    imageB: v.string(),
    votesB: v.number(),
    voteIds: v.array(v.id("users")),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    comments: v.array(v.id("comments")),
  }),

  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    endsOn: v.optional(v.number()),
    credits: v.number(),
    isAdmin: v.optional(v.boolean()),
  })
    .index("by_user_id", ["userId"])
    .index("by_sub_id", ["subscriptionId"]),

  comments: defineTable({
    imageTestId: v.id("images"),
    userId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  }).index("by_test_id", ["imageTestId"]),

  followers: defineTable({
    userId: v.id("users"),
    targetUserId: v.id("users"),
  })
    .index("by_user_id", ["userId"])
    .index("by_userId_targetUserId", ["userId", "targetUserId"]),
});
