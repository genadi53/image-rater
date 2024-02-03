import {
  ActionCtx,
  MutationCtx,
  QueryCtx,
  mutation,
  query,
  action,
} from "./_generated/server";
import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";
import { getFullUser } from "./users";

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => ({
    user: await getUserOrThrow(ctx),
  }))
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => ({
    user: await getUserOrThrow(ctx),
  }))
);

export const adminAuthMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await getUserOrThrow(ctx);

    if (!user.isAdmin) {
      throw new ConvexError("You must be admin!");
    }

    return { user };
  })
);

async function getUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const userId = await getUserId(ctx);

  if (!userId) {
    throw new ConvexError("You must be logged in");
  }

  const user = await getFullUser(ctx, userId);

  if (!user) {
    throw new ConvexError("user not found");
  }

  return user;
}

export const getUserId = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const getUser = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  return await ctx.auth.getUserIdentity();
};
