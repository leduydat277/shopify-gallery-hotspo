
import { useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
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
    TextField,
} from "@shopify/polaris";
import {
    getGalleryById,
    getProduct,
    updateGallery,
    createGallery,
} from "app/utils/gallery.server";
import { authenticate } from "../shopify.server";
import { SaveIcon } from "@shopify/polaris-icons";
import { GalleryImage } from "app/component/GalleryImages";
import { HotspotList } from "app/component/HotPostList";
import path from "path";
import fs from "fs/promises";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    if (params.id === "new") {
        return json({
            gallery: {
                _id: null,
                name: "",
                imageUrl: "",
                hotspots: [],
                createdAt: "",
            },
            products: [],
        });
    }

    const gallery = await getGalleryById(params.id);
    const { admin } = await authenticate.admin(request);
    const products = await getProduct({ admin });

    return json({ gallery, products });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
    const formData = await request.formData();
    const galleryId = params.id;
    const action = formData.get("action");

    try {
        const name = formData.get("name") as string;

        if (action === "new" || galleryId === "new") {
            const uploadDir = path.resolve("public/uploads");
            await fs.mkdir(uploadDir, { recursive: true });

            const file = formData.get("file") as File;
            if (!file || !(file instanceof File)) {
                throw new Error("❌ No file uploaded!");
            }

            const filePath = path.join(uploadDir, file.name);
            await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

            const newGallery = await createGallery({
                name,
                imageUrl: `/uploads/${file.name}`,
                hotspots: [],
            });

            return json({ success: true, message: "Gallery created successfully!", gallery: newGallery });
        }

        const updatedHotspots = formData
            .getAll("hotspot")
            .map((hotspotStr: string) => JSON.parse(hotspotStr));

        await updateGallery(galleryId, { hotspots: updatedHotspots });

        return json({ success: true });
    } catch (error) {
        console.error("❌ Error processing request:", error);
        return json({ success: false, error: error.message });
    }
};

function GalleryDetail() {
    const { gallery, products } = useLoaderData<typeof loader>();
    const [name, setName] = useState(gallery.name);
    const [hotspots, setHotspots] = useState(gallery.hotspots || []);
    const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
    const fetcher = useFetcher();

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

    const handleSave = () => {
        const formData = new FormData(document.getElementById("galleryForm"));
        formData.append("name", name);
        formData.append("action", gallery._id ? "update" : "new");

        fetcher.submit(formData, {
            method: "post",
            encType: "multipart/form-data",
        });
    };

    return (
        <Page
            backAction={{ content: "Back to Galleries", url: "/app" }}
            title="Gallery Detail"
            primaryAction={{ content: "Save", onAction: handleSave }}
        >
            <Form method="post" id="galleryForm" encType="multipart/form-data">
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
                                <TextField
                                    label="Name"
                                    value={name}
                                    autoComplete="off"
                                    onChange={(value) => setName(value)}
                                    name="name"
                                />
                                {!gallery.imageUrl ? (
                                    <Box>
                                        <label h htmlFor="file-upload">
                                            <Text>Upload Image</Text>
                                            <input type="file" id="file" name="file" />
                                        </label>
                                    </Box>
                                ) : null}

                                <Text as="h2" variant="headingMd">
                                    File Name: {gallery.imageUrl}
                                </Text>
                            </BlockStack>
                        </Card>

                        <Card roundedAbove="sm">
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">
                                    Media
                                </Text>
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
                                <Text as="h2" variant="headingMd">
                                    Information
                                </Text>
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
