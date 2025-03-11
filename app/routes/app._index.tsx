import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Button, Modal, TextContainer, Frame } from "@shopify/polaris";
import { Table } from "app/component/IndexTable";
import { deleteGallery, getGalleries } from "app/utils/gallery.server";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data = await getGalleries();
  return json({ data });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  console.log("formData", formData)
  console.log("formData", formData)
  console.log("formData", formData)
  console.log("formData", formData)
  const selectedIds = JSON.parse(formData.get("selectedIds") as string);
  console.log("selectedIds", selectedIds)
  console.log("selectedIds", selectedIds)
  console.log("selectedIds", selectedIds)
  console.log("selectedIds", selectedIds)
    ;

  await Promise.all(selectedIds.map((id) => deleteGallery(id)));

  return json({ success: true });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalActive, setModalActive] = useState(false);
  const navigate = useNavigate();
  const fecher = useFetcher();




  const handleDelete = async () => {
    setDeleteLoading(true);
    const formData = new FormData();
    formData.append("selectedIds", JSON.stringify(selectedIds));
    console.log("selectedIds", selectedIds);

    try {
      await fecher.submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
      await fecher.state === "idle" && navigate("/app");
    } finally {
      setDeleteLoading(false);
      setModalActive(false);
    }
  };

  const showModal = (ids: string[]) => {
    setSelectedIds(ids);
    setModalActive(true);
  };
  const handleNewGallery = () => {
    setLoading(true);
    navigate("/app/gallery/new");
  };

  const handleModalClose = () => {
    if (!deleteLoading) setModalActive(false);
  };

  return (
    <Page
      primaryAction={{
        content: "New",
        disabled: loading,
        onAction: handleNewGallery,
      }}
    >
      <Frame>
        <Form method="post">
          <Table gallery={data} onDelete={showModal} />
        </Form>

        <Modal
          open={modalActive}
          onClose={handleModalClose}
          title="Delete Gallery"
          primaryAction={{
            content: deleteLoading ? "Deleting..." : "Delete",
            onAction: handleDelete,
            destructive: true,
            loading: deleteLoading,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleModalClose,
              disabled: deleteLoading,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>Are you sure you want to delete the selected gallery?</p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </Page>
  );
}
