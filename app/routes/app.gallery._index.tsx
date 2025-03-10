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

    const navigate = useNavigate();
    return (
        <Page
            primaryAction={{
                content: "New",
                disabled: false,
                onAction: () => navigate("/app/new"),
            }}
        >
            <Table gallery={data} />
        </Page>
    );
}
