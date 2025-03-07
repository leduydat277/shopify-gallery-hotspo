import { useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Page, InlineStack, Button, Card, Text, Link } from "@shopify/polaris";
import { getGalleryById, getProduct, updateGallery } from "app/utils/gallery.server";
import { authenticate } from "../shopify.server";


export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const gallery = await getGalleryById(params.id);
    const { admin } = await authenticate.admin(request);
    const products = await getProduct({ admin });
    return json({ gallery, products });
};


export const action = async ({ request, params }: LoaderFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const galleryId = params.id;


    const updatedHotspots = formData.getAll("hotspot").map((hotspotStr: string) => {
        const hotspot = JSON.parse(hotspotStr);

        return {
            id: hotspot.id,
            x: hotspot.x,
            y: hotspot.y,
            productId: hotspot.productId ?? null,
        };
    });


    await updateGallery(galleryId, { hotspots: updatedHotspots });
    return json({ success: true });
};

const GalleryImage = ({ gallery, hotspots, setHotspots, products, selectedHotspot, setSelectedHotspot }: any) => {
    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newHotspot = { id: `${Date.now()}`, x, y, productId: null };
        setHotspots((prev: any) => [...prev, newHotspot]);
        setSelectedHotspot(hotspots.length);
    };

    return (
        <Card sectioned>
            <div style={{ position: "relative", width: "500px", margin: "0 auto" }}>
                <img
                    src={gallery.imageUrl}
                    alt={gallery.name}
                    style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                    onClick={handleImageClick}
                />
                {hotspots.map((hotspot: any, index: number) => (
                    <div
                        key={hotspot.id}
                        style={{
                            position: "absolute",
                            top: `${hotspot.y}%`,
                            left: `${hotspot.x}%`,
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "blue",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: "pointer",
                            border: "2px solid white",
                        }}
                        onClick={() => setSelectedHotspot(index)}
                    >
                        {selectedHotspot === index ? <strong>{index + 1}</strong> : `Hotspot ${index + 1}`}
                    </div>
                ))}
            </div>
        </Card>
    );
};

const HotspotList = ({ hotspots, products, setHotspots, selectedHotspot, setSelectedHotspot }: any) => {
    const handleHotspotDelete = (index: number) => {
        setHotspots(hotspots.filter((_, i) => i !== index));
    };

    const handleProductSelectForEdit = (index: number, productId: number) => {
        const newHotspots = hotspots.map((hotspot: any, i: number) =>
            i === index ? { ...hotspot, productId } : hotspot
        );
        setHotspots(newHotspots);
        setSelectedHotspot(null);
    };

    return (
        <Card sectioned title="Selected Hotspots">
            {hotspots.map((hotspot: any, index: number) => {
                const product = products?.find((p: any) => p.node.id === hotspot.productId);
                return (
                    <div key={hotspot.id} style={{ marginBottom: "10px" }}>
                        <Text variant="bodySm">Hotspot {index + 1}:</Text>
                        {product ? <Text variant="bodySm">{product.node.title}</Text> : <Text variant="bodySm">No product selected</Text>}

                        {selectedHotspot === index && (
                            <div style={{ marginTop: "10px" }}>
                                <Text variant="bodySm">Select a product for this hotspot:</Text>
                                {products?.map((product: any) => (
                                    <Link url='#products on my store'>
                                        <Button
                                            key={product.node.id}
                                            onClick={() => handleProductSelectForEdit(index, product.node.id)}
                                        >
                                            {product.node.title}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <InlineStack align="center" gap="tight" style={{ marginTop: "8px" }}>
                            <Button onClick={() => setSelectedHotspot(index)} color="blue" size="slim">
                                Edit
                            </Button>
                            <Button onClick={() => handleHotspotDelete(index)} color="red" size="slim">
                                Xóa
                            </Button>
                        </InlineStack>
                    </div>
                );
            })}
        </Card>
    );
};

const GalleryDetail = () => {
    const { gallery, products } = useLoaderData<typeof loader>();
    const [hotspots, setHotspots] = useState<{ id: string; x: number; y: number; productId?: number }[]>(gallery.hotspots || []);
    const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);

    return (
        <Page title={gallery.name}>
            <InlineStack align="start" gap="loose">
                <Form method="post" encType="multipart/form-data">
                    {/* Image with hotspots */}
                    <GalleryImage
                        gallery={gallery}
                        hotspots={hotspots}
                        setHotspots={setHotspots}
                        products={products}
                        selectedHotspot={selectedHotspot}
                        setSelectedHotspot={setSelectedHotspot}
                    />


                    <HotspotList
                        hotspots={hotspots}
                        products={products}
                        setHotspots={setHotspots}
                        selectedHotspot={selectedHotspot}
                        setSelectedHotspot={setSelectedHotspot}
                    />


                    <input type="hidden" name="name" value={gallery.name} />
                    <input type="hidden" name="imageUrl" value={gallery.imageUrl} />
                    {hotspots.map((hotspot) => (
                        <input key={hotspot.id} type="hidden" name="hotspot" value={JSON.stringify(hotspot)} />
                    ))}

                    <Button submit primary>
                        Save Gallery
                    </Button>
                </Form>
            </InlineStack>
        </Page>
    );
};

export default GalleryDetail;
