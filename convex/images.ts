import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createImage = mutation({
  args: {
    title: v.string(),
    imageA: v.string(),
    imageB: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.insert("images", {
      title: args.title,
      imageA: args.imageA,
      imageB: args.imageB,
      userId: "",
    });
  },
});
