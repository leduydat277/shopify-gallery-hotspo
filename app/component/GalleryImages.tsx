import { Card } from "@shopify/polaris";
import { DropZoneImage } from "./DropZone";

export const GalleryImage = ({
    gallery,
    hotspots,
    setHotspots,
    setSelectedHotspot,
    previewImageUrl
}: any) => {

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newHotspot = { id: `${Date.now()}`, x, y, productId: null };
        setHotspots((prev: any) => [...prev, newHotspot]);
        setSelectedHotspot(hotspots.length);
    };

    const handleMouseDown =
        (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            setSelectedHotspot(index);

            const img = e.currentTarget.parentElement?.querySelector("img");
            if (!img) return;

            const rect = img.getBoundingClientRect();
            const startX = e.clientX;
            const startY = e.clientY;
            let startXPercent = hotspots[index].x;
            let startYPercent = hotspots[index].y;

            const handleMouseMove = (moveEvent: MouseEvent) => {
                const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
                const dy = ((moveEvent.clientY - startY) / rect.height) * 100;

                const newX = Math.min(100, Math.max(0, startXPercent + dx));
                const newY = Math.min(100, Math.max(0, startYPercent + dy));

                console.log("Dragging hotspot:", index);
                console.log("Old position:", { x: startXPercent, y: startYPercent });
                console.log("New position:", { x: newX, y: newY });

                setHotspots((prev: any) =>
                    prev.map((hotspot: any, i: number) =>
                        i === index ? { ...hotspot, x: newX, y: newY } : hotspot,
                    ),
                );
            };

            const handleMouseUp = () => {
                console.log("Hotspot released:", index);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        };

    return (
        <Card sectioned>
            <div style={{ position: "relative", width: "500px", margin: "0 auto" }}>
                {/* {!gallery.imageUrl ? <DropZoneImage /> : */}
                <>
                    <img
                        src={gallery.imageUrl || previewImageUrl}
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
                                borderRadius: "50%",
                                fontSize: "12px",
                                cursor: "grab",
                                border: "2px solid white",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onMouseDown={handleMouseDown(index)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </>
                {/* } */}
            </div>
        </Card>
    );
};
