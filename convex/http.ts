import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const headerPayload = await req.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created": {
          const userData = {
            email: result.data.email_addresses[0]?.email_address,
            name: `${result.data.first_name} ${result.data.last_name}`,
            userId: result.data.id,
            profileImage: result.data.image_url,
          };
          await ctx.runMutation(api.users.createUser, { ...userData });
        }
      }
      return new Response(null, { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const signature = req.headers.get("stripe-signature") as string;
    const payload = await req.text();

    const result = await ctx.runAction(internal.stripe.fulfill, {
      payload,
      signature,
    });

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response("Error Stripe Webhook", {
        status: 400,
      });
    }
  }),
});

export default http;
