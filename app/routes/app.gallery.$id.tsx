import { useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
    Page,
    Button,
    Card,
    Text,
    InlineGrid,
    BlockStack,
    Divider,
    Box,
} from "@shopify/polaris";
import {
    getGalleryById,
    getProduct,
    updateGallery,
} from "app/utils/gallery.server";
import { authenticate } from "../shopify.server";
import { SaveIcon } from "@shopify/polaris-icons";
import { GalleryImage } from "app/component/GalleryImages";
import { HotspotList } from "app/component/HotPostList";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    console.log("Gallery ID:", params.id);
    const gallery = await getGalleryById(params.id);
    const { admin } = await authenticate.admin(request);
    const products = await getProduct({ admin });
    return json({ gallery, products });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const galleryId = params.id;

    const updatedHotspots = formData
        .getAll("hotspot")
        .map((hotspotStr: string) => JSON.parse(hotspotStr));

    console.log("Saved hotspots:", updatedHotspots);

    await updateGallery(galleryId, { hotspots: updatedHotspots });
    return json({ success: true });
};

function GalleryDetail() {
    const { gallery, products } = useLoaderData<typeof loader>();
    const [hotspots, setHotspots] = useState<
        { id: string; x: number; y: number; productId?: number }[]
    >(gallery.hotspots || []);
    const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);

    const createRandomHotspot = () => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const newHotspot = {
            id: `${Date.now()}`,
            x: randomX,
            y: randomY,
            productId: null,
        };
        setHotspots((prev) => [...prev, newHotspot]);
    };

    return (
        <Page
            backAction={{ content: "Back to Galleries", url: "/app" }}
            title="Gallery Detail"
            secondaryActions={[
                {
                    content: "Save",
                    icon: SaveIcon,
                    onAction: () => document.getElementById("galleryForm")?.submit(),

                },
            ]}
        >
            <Form method="post" id="galleryForm">
                {hotspots.map((hotspot) => (
                    <input
                        key={hotspot.id}
                        type="hidden"
                        name="hotspot"
                        value={JSON.stringify(hotspot)}
                    />
                ))}

                <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="400">
                    <BlockStack gap="400">
                        <Card roundedAbove="sm">
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Name: {gallery.name}</Text>
                                <Text as="h2" variant="headingMd">File Name: {gallery.imageUrl}</Text>
                            </BlockStack>
                        </Card>

                        <Card roundedAbove="sm">
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Media</Text>
                                <GalleryImage
                                    gallery={gallery}
                                    hotspots={hotspots}
                                    setHotspots={setHotspots}
                                    products={products}
                                    selectedHotspot={selectedHotspot}
                                    setSelectedHotspot={setSelectedHotspot}
                                />
                            </BlockStack>
                        </Card>
                    </BlockStack>

                    <BlockStack gap={{ xs: "400", md: "200" }}>
                        <Card roundedAbove="sm">
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Information</Text>
                                <Button onClick={createRandomHotspot}>Add Hotspot</Button>
                                <Text as="h2" variant="headingMd">
                                    Total Hotspots: {hotspots.length}
                                </Text>
                                <Divider />
                                <HotspotList
                                    hotspots={hotspots}
                                    products={products}
                                    setHotspots={setHotspots}
                                    selectedHotspot={selectedHotspot}
                                    setSelectedHotspot={setSelectedHotspot}
                                />
                            </BlockStack>
                        </Card>
                    </BlockStack>
                </InlineGrid>


            </Form>
        </Page>
    );
}

export default GalleryDetail;
