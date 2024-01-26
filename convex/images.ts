import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createImageTest = mutation({
  args: {
    title: v.string(),
    imageA: v.string(),
    imageB: v.string(),
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.insert("images", {
      ...args,
    });
  },
});

export const getImageTestById = query({
  args: {
    testId: v.id("images"),
  },

  handler: async (ctx, args) => {
    return ctx.db.get(args.testId);
  },
});
