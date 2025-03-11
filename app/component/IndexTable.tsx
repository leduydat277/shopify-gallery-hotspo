import { Form, Link } from "@remix-run/react";
import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Thumbnail,
    useBreakpoints,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import React from "react";

export const Table = ({ gallery, onDelete }) => {
    const resourceName = {
        singular: "gallery",
        plural: "galleries",
    };

    const {
        selectedResources,
        allResourcesSelected,
        handleSelectionChange,
    } = useIndexResourceState(gallery, {
        resourceIDResolver: (galleryItem) => galleryItem._id,
    });

    const rowMarkup = gallery.map(({ _id, name, imageUrl, createdAt }, index) => (
        <IndexTable.Row
            id={_id}
            key={_id}
            position={index}
            selected={selectedResources.includes(_id)}
        >
            <IndexTable.Cell>
                <Link to={`/app/gallery/${_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {name}
                    </Text>
                </Link>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Thumbnail source={imageUrl} alt={name} size="small" />
            </IndexTable.Cell>
            <IndexTable.Cell>{new Date(createdAt).toLocaleString()}</IndexTable.Cell>
        </IndexTable.Row>
    ));

    const bulkActions = [
        {
            icon: DeleteIcon,
            destructive: true,
            content: "Delete galleries",
            onAction: () => onDelete(selectedResources),
        },
    ];

    return (
        <LegacyCard>
            <IndexTable
                condensed={useBreakpoints().smDown}
                resourceName={resourceName}
                itemCount={gallery.length}
                selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[{ title: "Name" }, { title: "Image" }, { title: "Date" }]}
                bulkActions={bulkActions}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );
};

export default Table;
