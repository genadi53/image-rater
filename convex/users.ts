import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { getUser, getUserId } from "./utils";
import { CONSTANTS } from "../src/lib/constants";

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
      credits: CONSTANTS.USER_FREE_CREDITS,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    userId: v.string(),
    name: v.string(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      profileImage: args.profileImage,
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
    const user = await getFullUser(ctx, args.userId);
    if (!user) {
      throw new ConvexError("No user with this id!");
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
      throw new ConvexError("No user with this sub id!");
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
      endsOn: args.endsOn,
    });
  },
});

export const getLoggedUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return null;
      // throw new ConvexError("No user with this id!");
    }

    return getFullUser(ctx, userId);
  },
});

export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await getFullUser(ctx, args.userId);
    return user;
  },
});

export const updateMyProfile = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("you must be authenticated");
    }

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new ConvexError("No user with this id!");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
    });
  },
});

export const isUserSubscribed = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getUserId(ctx);

  if (!userId) {
    throw new ConvexError("No user with this id!");
  }

  const userToCheck = await getFullUser(ctx, userId);

  return userToCheck && (userToCheck.endsOn ?? 0) > Date.now();
};

export const getFullUser = (ctx: QueryCtx | MutationCtx, userId: string) => {
  return ctx.db
    .query("users")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .first();
};
