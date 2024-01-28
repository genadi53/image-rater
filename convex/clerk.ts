"use node";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { action, internalAction } from "./_generated/server";
import { Webhook } from "svix";
import { v } from "convex/values";

export const fulfill = internalAction({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  async handler(ctx, args) {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
});
