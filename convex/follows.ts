import { ConvexError, v } from "convex/values";
import { authMutation, authQuery } from "./utils";
import { query } from "./_generated/server";
import { getFullUser } from "./users";

export const followUser = authMutation({
  args: {
    targetUserId: v.id("users"),
  },
  async handler(ctx, args) {
    if (args.targetUserId === ctx.user._id) {
      throw new ConvexError("Cannot follow yourself!");
    }

    const targetUser = await ctx.db
      .query("followers")
      .withIndex("by_userId_targetUserId", (q) =>
        q.eq("userId", ctx.user._id).eq("targetUserId", args.targetUserId)
      )
      .first();

    if (targetUser) {
      throw new ConvexError("Already follow this user!");
    }

    await ctx.db.insert("followers", {
      userId: ctx.user._id,
      targetUserId: args.targetUserId,
    });
  },
});

export const getUserFollowers = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const user = await getFullUser(ctx, args.userId);

    if (!user) {
      throw new ConvexError("No sich user!");
    }

    return await ctx.db
      .query("followers")
      .withIndex("by_userId_targetUserId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const isFollowerOf = authQuery({
  args: {
    targetUserId: v.id("users"),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("followers")
      .withIndex("by_userId_targetUserId", (q) =>
        q.eq("userId", ctx.user._id).eq("targetUserId", args.targetUserId)
      )
      .first();
  },
});

export const unfollowUser = authMutation({
  args: {
    targetUserId: v.id("users"),
  },
  async handler(ctx, args) {
    const targetUser = await ctx.db
      .query("followers")
      .withIndex("by_userId_targetUserId", (q) =>
        q.eq("userId", ctx.user._id).eq("targetUserId", args.targetUserId)
      )
      .first();

    if (!targetUser) {
      throw new ConvexError("Already unfollowed this user!");
    }

    await ctx.db.delete(targetUser._id);
  },
});
