import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createImage = mutation({
  args: {
    title: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.insert("", {
      title: args.title,
    });
  },
});
