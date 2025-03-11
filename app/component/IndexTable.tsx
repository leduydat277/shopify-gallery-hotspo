import {
    IndexTable,
    LegacyCard,
    Text,
    Thumbnail,
} from "@shopify/polaris";
import { Link } from "@remix-run/react";

export const Table = ({ gallery }: any) => {
    const resourceName = {
        singular: "gallery",
        plural: "galleries",
    };

    const rowMarkup = gallery.map(({ _id, name, imageUrl, createdAt }, index) => (
        <IndexTable.Row id={_id} key={_id} position={index}>
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

    return (
        <LegacyCard>
            <IndexTable
                resourceName={resourceName}
                itemCount={gallery.length}
                selectable={false}
                headings={[{ title: "Name" }, { title: "Image" }, { title: "Date" }]}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );
};

export default Table;
