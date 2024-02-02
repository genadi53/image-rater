import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser, getUserId } from "./utils";
import { paginationOptsValidator } from "convex/server";
import { getFullUser, isUserSubscribed } from "./users";
import { Doc } from "./_generated/dataModel";

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
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new ConvexError("You must be loged in!");
    }

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new ConvexError("No such user with this id!");
    }

    const isSubscirbed = await isUserSubscribed(ctx);

    if (!isSubscirbed && user.credits <= 0) {
      throw new ConvexError("You must be subscribed!");
    }

    const imageTestId = await ctx.db.insert("images", {
      ...args,
      votesA: 0,
      votesB: 0,
      voteIds: [],
      comments: [],
    });

    await ctx.db.patch(user._id, {
      credits: Math.max(0, user.credits - 1),
    });

    return imageTestId;
  },
});

export const getImageTestById = query({
  args: {
    testId: v.id("images"),
  },

  handler: async (ctx, args) => {
    try {
      const isSubscirbed = await isUserSubscribed(ctx);
      const imageTest = await ctx.db.get(args.testId);

      if (!imageTest) {
        throw new ConvexError("No test with this id!");
      }

      let comments =
        imageTest.comments.length === 0 ? [] : [imageTest.comments[0]];

      if (isSubscirbed) {
        comments = imageTest.comments;
      }

      return { ...imageTest, comments };
    } catch (error) {
      console.error(error);
      return null;
    }
  },
});

export const getMyImageTests = query({
  args: {},
  handler: async (ctx, args) => {
    try {
      const userId = await getUserId(ctx);

      if (!userId) {
        throw new ConvexError("Need to log in!");
      }

      return ctx.db
        .query("images")
        .filter((q) => q.eq(q.field("userId"), userId))
        .order("asc")
        .collect();
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

export const getImageTestsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await getFullUser(ctx, args.userId);

      if (!user) {
        throw new ConvexError("No such user!");
      }

      return ctx.db
        .query("images")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .order("asc")
        .collect();
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
      throw new ConvexError("You must log in!");
    }

    const imageTest = await ctx.db.get(args.testId);

    if (!imageTest) {
      throw new ConvexError("Invalid Image Test Id!");
    }

    if (imageTest.voteIds.includes(userId)) {
      throw new ConvexError("Cannot vote again!");
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

export const addComment = mutation({
  args: {
    testId: v.id("images"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) {
      throw new ConvexError("You must log in!");
    }

    const imageTest = await ctx.db.get(args.testId);

    if (!imageTest) {
      throw new ConvexError("No such image test!");
    }

    const newComments = imageTest.comments ?? [];
    newComments.unshift({
      userId: user.subject,
      name: user.name,
      profileImage: user.pictureUrl,
      text: args.text,
      createdAt: Date.now(),
    });

    await ctx.db.patch(imageTest._id, {
      comments: newComments,
    });

    return null;
  },
});

export const deleteImageTest = mutation({
  args: {
    testId: v.id("images"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new ConvexError("You must log in!");
    }

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new ConvexError("No user with such id!");
    }

    if (!user.isAdmin) {
      throw new ConvexError("You must be an admin to delete test!");
    }

    const imageTest = await ctx.db.get(args.testId);

    if (!imageTest) {
      throw new ConvexError("No such image test!");
    }

    await ctx.db.delete(imageTest._id);
  },
});
