import { ActionFunction } from "@remix-run/node";
import { authenticate } from "app/shopify.server";

export const action: ActionFunction = async ({ request }) => {
    const { payload, session, topic, shop } = await authenticate.webhook(request);

    console.log("🔔 [Webhook Event Received]");
    console.log("Shop:", shop);
    console.log("Event:", topic);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    switch (topic) {
        case "PRODUCTS_CREATE":
            console.log(" Product created:", payload.title);
            break;
        case "PRODUCTS_UPDATE":
            console.log(" Product updated:", payload.title);
            break;
        case "PRODUCTS_DELETE":
            console.log(" Product deleted:", payload.id);
            break;
        default:
            console.log("Unhandled event:", topic);
    }

    return new Response("Webhook received and logged", { status: 200 });
};
