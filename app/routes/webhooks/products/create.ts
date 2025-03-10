import { json } from "@remix-run/node";

export const action = async ({ request }: { request: Request }) => {
    const payload = await request.json();
    console.log("Product created:", payload);
    return json({ success: true });
};
