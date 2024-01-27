import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils";

export const createImageTest = mutation({
  args: {
    title: v.string(),
    imageA: v.string(),
    imageB: v.string(),
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    const imageTestId = await ctx.db.insert("images", {
      ...args,
      votesA: 0,
      votesB: 0,
      voteIds: [],
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
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Need to log in!");
    }

    return ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .collect();
  },
});

export const voteOnImage = mutation({
  args: {
    testId: v.id("images"),
    imageId: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    console.log(user);
    if (!user) {
      throw new Error("You must log in!");
    }

    const imageTest = await ctx.db.get(args.testId);

    if (!imageTest) {
      throw new Error("Invalid Image Test Id!");
    }

    if (imageTest.voteIds.includes(user.subject)) {
      throw new Error("Cannot vote again!");
    }

    if (imageTest.imageA === args.imageId) {
      await ctx.db.patch(imageTest._id, {
        votesA: imageTest.votesA++,
        voteIds: [...imageTest.voteIds, user.subject],
      });
    }

    if (imageTest.imageB === args.imageId) {
      await ctx.db.patch(imageTest._id, {
        votesB: imageTest.votesB++,
        voteIds: [...imageTest.voteIds, user.subject],
      });
    }
  },
});
