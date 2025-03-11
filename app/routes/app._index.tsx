import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Page, Button } from "@shopify/polaris";
import { Table } from "app/component/IndexTable";
import { getGalleries } from "app/utils/gallery.server";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data = await getGalleries();
  return json({ data });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNewGallery = () => {
    setLoading(true);
    navigate("/app/gallery/new");
  };

  return (
    <Page
      primaryAction={{
        content: loading ? "Creating..." : "New Gallery",
        disabled: loading,
        onAction: handleNewGallery,
      }}
    >
      <Table gallery={data} />
    </Page>
  );
}
