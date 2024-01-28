import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
    });
  },
});

export const setStripeId = internalMutation({
  args: {
    userId: v.string(),
    subscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("No user with this id!");
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
    });
  },
});
