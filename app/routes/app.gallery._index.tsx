import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { Table } from "app/component/IndexTable";
import { getGalleries } from "app/utils/gallery.server";
import { useNavigate } from "@remix-run/react";
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const data = await getGalleries();
    return json({ data });
};

export default function Index() {
    const { data } = useLoaderData<typeof loader>();
    console.log("data.data", data);
    //https://admin.shopify.com/store/my-dev-store-hihi-haha/apps/efficient-conversion-app-9/app/gallery/new

    const navigate = useNavigate();
    return (
        <Page
            primaryAction={{
                content: "New Gallery",
                disabled: false,
                onAction: () => navigate("/app/gallery/new"),
            }}
        >
            <Table gallery={data} />
        </Page>
    );
}
