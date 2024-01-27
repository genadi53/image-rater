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
  }),
});
