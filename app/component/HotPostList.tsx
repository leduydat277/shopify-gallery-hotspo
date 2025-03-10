import { useState } from "react";
import { Button, Card, Text, Icon } from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";

export const HotspotList = ({
    hotspots,
    setHotspots,
}: any) => {

    // const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    const handleHotspotDelete = (index: number) => {
        console.log("Deleting hotspot at index:", index);
        setHotspots(hotspots.filter((_, i) => i !== index));
    };

    const handleProductSelectForEdit = async (index: number) => {
        try {
            // setLoadingIndex(index);
            console.log("Opening product picker for hotspot at index:", index);

            const { selection } = await shopify.resourcePicker({
                type: "product",

            });

            console.log("Selected product:", selection);

            if (selection && selection.length > 0) {
                const selectedProduct = selection[0];
                console.log("Product details:", {
                    id: selectedProduct.id,
                    title: selectedProduct.title,
                });

                const newHotspots = hotspots.map((hotspot: any, i: number) =>
                    i === index
                        ? { ...hotspot, productId: selectedProduct.id, productTitle: selectedProduct.title }
                        : hotspot,
                );

                console.log("Updated hotspots:", newHotspots);
                setHotspots(newHotspots);
            }
        } catch (error) {
            console.error("Error selecting product:", error);
        }
    };

    return (
        <Card sectioned title="Selected Hotspots">
            {hotspots.map((hotspot: any, index: number) => (
                <div
                    key={hotspot.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                    }}
                >
                    <div>
                        <Text variant="bodySm">Hotspot {index + 1}:</Text>
                        <Text variant="bodySm">
                            {hotspot.productTitle ?? "No product selected"}
                        </Text>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                            onClick={() => handleProductSelectForEdit(index)}
                        // loading={loadingIndex === index}
                        >
                            <Icon source={EditIcon} />
                        </Button>
                        <Button onClick={() => handleHotspotDelete(index)}>
                            <Icon source={DeleteIcon} />
                        </Button>
                    </div>
                </div>
            ))}
        </Card>
    );
};
