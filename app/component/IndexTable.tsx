import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Thumbnail,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";

export const Table = ({ gallery }: any) => {
    const navigate = useNavigate();
    const resourceName = {
        singular: "gallery",
        plural: "galleries",
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(gallery);

    const handleImageClick = (id: string) => {
        navigate(`/app/gallery/${id}`);
    };

    const rowMarkup = gallery.map(({ _id, name, imageUrl, createdAt }, index) => (
        <IndexTable.Row
            id={_id}
            key={_id}
            selected={selectedResources.includes(_id)}
            position={index}
        >
            <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                    {name}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <div
                    onClick={() => handleImageClick(_id)}
                    style={{ cursor: "pointer" }}
                >
                    <Thumbnail source={imageUrl} alt={name} size="small" />
                </div>
            </IndexTable.Cell>
            <IndexTable.Cell>{new Date(createdAt).toLocaleString()}</IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <LegacyCard>
            <IndexTable
                resourceName={resourceName}
                itemCount={gallery.length}
                selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[{ title: "Name" }, { title: "Image" }, { title: "Date" }]}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );
};
