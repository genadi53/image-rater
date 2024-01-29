import { v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { getUserId } from "./utils";

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

export const updateSubscription = internalMutation({
  args: {
    userId: v.string(),
    subscriptionId: v.string(),
    endsOn: v.number(),
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
      endsOn: args.endsOn,
    });
  },
});

export const updateSubscriptionBySubId = internalMutation({
  args: {
    subscriptionId: v.string(),
    endsOn: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_sub_id", (q) =>
        q.eq("subscriptionId", args.subscriptionId)
      )
      .first();

    if (!user) {
      throw new Error("No user with this sub id!");
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
      endsOn: args.endsOn,
    });
  },
});

export const getUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return null;
      // throw new Error("No user with this id!");
    }

    return ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
  },
});

export const isUserSubscribed = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getUserId(ctx);

  if (!userId) {
    throw new Error("No user with this id!");
  }

  const userToCheck = await ctx.db
    .query("users")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .first();

  return userToCheck && (userToCheck.endsOn ?? 0) > Date.now();
};
