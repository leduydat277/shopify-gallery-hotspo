import { useEffect, useState } from "react";
import { Card } from "@shopify/polaris";
import { DndContext } from "@dnd-kit/core";
import { useDraggable } from '@dnd-kit/core';

export const GalleryImage = ({
    newHotspots,
    gallery,
    previewImageUrl
}: any) => {
    const [hotspots, setHotspots] = useState(newHotspots || []);

    useEffect(() => {
        setHotspots(newHotspots);
    }, [newHotspots]);

    const handleDragEnd = (event: any) => {
        const { active, delta } = event;

        const updatedHotspots = hotspots.map((hotspot) =>
            hotspot._id === active.id
                ? {
                    ...hotspot,
                    x: Math.min(100, Math.max(0, hotspot.x + (delta.x / 500) * 100)),
                    y: Math.min(100, Math.max(0, hotspot.y + (delta.y / 500) * 100)),
                }
                : hotspot
        );

        setHotspots(updatedHotspots);
        console.log("Updated hotspots:", updatedHotspots);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div style={{ position: "relative", width: "500px", height: "500px", margin: "0 auto" }}>
                <img
                    src={gallery.imageUrl || previewImageUrl}
                    alt={gallery.name}
                    style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                />
                {hotspots.map((hotspot) => (
                    <DraggableHotspot key={hotspot._id} id={hotspot._id} x={hotspot.x} y={hotspot.y} />
                ))}
            </div>
        </DndContext>
    );
};

const DraggableHotspot = ({ id, x, y }: any) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const style = {
        position: "absolute",
        top: `${y}%`,
        left: `${x}%`,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
        width: "20px",
        height: "20px",
        backgroundColor: "blue",
        borderRadius: "50%",
        cursor: "grab",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "12px",
    };

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
            {id}
        </div>
    );
};
