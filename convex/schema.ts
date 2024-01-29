import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    title: v.string(),
    userId: v.string(),
    imageA: v.string(),
    votesA: v.number(),
    imageB: v.string(),
    votesB: v.number(),
    voteIds: v.array(v.string()),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    comments: v.optional(
      v.array(
        v.object({
          userId: v.string(),
          text: v.string(),
          createdAt: v.number(),
          name: v.optional(v.string()),
          profileImage: v.optional(v.string()),
        })
      )
    ),
  }),

  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    endsOn: v.optional(v.number()),
  })
    .index("by_user_id", ["userId"])
    .index("by_sub_id", ["subscriptionId"]),
});
