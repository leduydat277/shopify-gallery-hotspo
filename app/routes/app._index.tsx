
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import {
  Link,
  Page
} from "@shopify/polaris";
import { Table } from "app/component/IndexTable";
import { getGalleries } from "app/utils/gallery.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data = await getGalleries();
  return json({ data });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  console.log('data.data', data);

  return (
    <Page>
      <Link url="/app/new">
        <button>New</button>
      </Link>
      <Table gallery={data} />
    </Page>
  );
}
