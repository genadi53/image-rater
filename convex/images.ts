import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser, getUserId } from "./utils";
import { paginationOptsValidator } from "convex/server";
import { isUserSubscribed } from "./users";

export const createImageTest = mutation({
  args: {
    title: v.string(),
    imageA: v.string(),
    imageB: v.string(),
    userId: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const isSubscirbed = await isUserSubscribed(ctx);

    if (!isSubscirbed) {
      throw new Error("You must be subscribed!");
    }

    const imageTestId = await ctx.db.insert("images", {
      ...args,
      votesA: 0,
      votesB: 0,
      voteIds: [],
      comments: [],
    });
    return imageTestId;
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

export const getImageTestByUser = query({
  args: {},
  handler: async (ctx, args) => {
    try {
      const userId = await getUserId(ctx);

      if (!userId) {
        throw new Error("Need to log in!");
      }

      return (
        ctx.db
          .query("images")
          .filter((q) => q.eq(q.field("userId"), userId))
          // .order("asc")
          .collect()
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

export const getLatestImageTests = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("images")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const voteOnImage = mutation({
  args: {
    testId: v.id("images"),
    imageId: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("You must log in!");
    }

    const imageTest = await ctx.db.get(args.testId);

    if (!imageTest) {
      throw new Error("Invalid Image Test Id!");
    }

    if (imageTest.voteIds.includes(userId)) {
      throw new Error("Cannot vote again!");
    }

    if (imageTest.imageA === args.imageId) {
      imageTest.votesA++;
      await ctx.db.patch(imageTest._id, {
        votesA: imageTest.votesA,
        voteIds: [...imageTest.voteIds, userId],
      });
    }

    if (imageTest.imageB === args.imageId) {
      imageTest.votesB++;
      await ctx.db.patch(imageTest._id, {
        votesB: imageTest.votesB,
        voteIds: [...imageTest.voteIds, userId],
      });
    }
  },
});
