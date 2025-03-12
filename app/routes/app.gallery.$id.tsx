import { useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useFetcher, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { SaveBar } from "@shopify/app-bridge-react";
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
  InlineStack,
} from "@shopify/polaris";

import {
  getGalleryById,
  getProduct,
  updateGallery,
  createGallery,
  deleteGallery,
  duplicateGallery,
} from "app/utils/gallery.server";
import { authenticate } from "../shopify.server";

import { GalleryImage } from "app/component/GalleryImages";
import { HotspotList } from "app/component/HotPostList";
import path from "path";
import fs from "fs/promises";
import { DropZoneImage } from "app/component/DropZone";

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
      const crateHotspots = formData
        .getAll("hotspot")
        .map((hotspotStr) => {
          try {
            return JSON.parse(hotspotStr);
          } catch (err) {
            console.error("❌ Error parsing hotspot data:", err);
            return null;
          }
        })
        .filter(Boolean);
      console.log("createHotspot", crateHotspots);

      const newGallery = await createGallery({
        name,
        imageUrl: `/uploads/${file.name}`,
        hotspots: {
          productUrl: "default",
          productId: crateHotspots[0].productId,
          productName: crateHotspots[0].productName,
          productImage: "default",
          x: crateHotspots[0].x,
          y: crateHotspots[0].y,
        },
      });

      return json({
        success: true,
        message: "Gallery created successfully!",
        gallery: newGallery,
      });
    }

    if (action === "delete") {
      await deleteGallery(galleryId);
      return json({ success: true, message: "Gallery deleted successfully!" });
    }

    if (action === "duplicate") {
      const newGallery = await duplicateGallery(galleryId);
      return json({
        success: true,
        message: "Gallery duplicated successfully!",
        gallery: newGallery,
      });
    }

    if (action === "update") {
      const updatedHotspots = formData
        .getAll("hotspot")
        .map((hotspotStr) => {
          try {
            const hotspot = JSON.parse(hotspotStr);

            delete hotspot._id;
            return hotspot;
          } catch (err) {
            console.error("❌ Error parsing hotspot data:", err);
            return null;
          }
        })
        .filter(Boolean);
      console.log("updateHotspot", updatedHotspots);
      console.log("updateHotspot", updatedHotspots);
      console.log("updateHotspot", updatedHotspots);
      console.log("updateHotspot", galleryId);

      await updateGallery(galleryId, {
        hotspots: updatedHotspots,
        name: name || "",
      });

      return json({ success: true });
    }

    return json({ success: true });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return json({ success: false, error: error.message });
  }
};

function GalleryDetail() {
  const { gallery, products } = useLoaderData<typeof loader>();
  const [name, setName] = useState(gallery.name);
  const [originalName, setOriginalName] = useState(gallery.name);
  const [file, setFile] = useState<File | null>(null);
  const [hotspots, setHotspots] = useState(gallery.hotspots || []);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    gallery.imageUrl || null,
  );

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isNewGallery = !gallery._id;
  const createRandomHotspot = () => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const newHotspot = {
      _id: `${Date.now()}`,
      x: randomX,
      y: randomY,
      productId: null,
      productName: "New Product",
      productUrl: "New Product",
      productImage: "New Product",
    };
    setHotspots((prev) => [...prev, newHotspot]);
    setUnsavedChanges(true);
    console.log("newHotspot", newHotspot);
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setPreviewImageUrl(URL.createObjectURL(uploadedFile));
  };

  const handleSave = () => {
    const formData = new FormData(document.getElementById("galleryForm"));

    formData.append("name", name);
    formData.append("action", isNewGallery ? "new" : "update");

    if (file) {
      formData.append("file", file);
    }

    hotspots.forEach((hotspot) => {
      formData.append("hotspot", JSON.stringify(hotspot));
    });

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });

    navigate("/app");
  };

  const showModal = async () => {
    await shopify.modal.show("my-modal");

  };

  const handleDelete = async () => {

    const formData = new FormData(document.getElementById("galleryForm"));
    formData.append("action", "delete");

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });

    await shopify.modal.hide("my-modal");

    fetcher.state === "idle" && navigate("/app");
  };

  const handleDuplicate = async () => {
    await shopify.modal.show("duplicate-modal");
  };

  const handleConfirmDuplicate = () => {
    const formData = new FormData(document.getElementById("galleryForm"));
    formData.append("action", "duplicate");

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });

    shopify.modal.hide("duplicate-modal");

    fetcher.state === "idle" && navigate("/app");
  };

  const isSubmitting = fetcher.state === "submitting";
  const handleSave2 = () => {
    handleSave();
    shopify.saveBar.hide("my-save-bar");
  };

  const handleDiscard = () => {
    if (!originalName) {
      return navigate("/app");
    }
    setName(originalName);
    shopify.saveBar.hide("my-save-bar");
    console.log("Discarding changes, reverting to:", originalName);
  };
  const handleNameChange = (value: string) => {
    setName(value);
    setUnsavedChanges(true);
    shopify.saveBar.show("my-save-bar");
  };
  console.log("setPreviewImageUrl", previewImageUrl);

  const handleBack = () => {
    shopify.saveBar.leaveConfirmation().then(() => {
      navigate("/app");
    });
  };
  return (
    <Page
      backAction={{ content: "Back to Galleries", onAction: handleBack }}
      title={isNewGallery ? "Create New Gallery" : "Gallery Detail"}
      secondaryActions={
        isNewGallery
          ? []
          : [
            {
              content: "Duplicate",
              accessibilityLabel: "Duplicate this gallery",
              onAction: handleDuplicate,
            },
          ]
      }
    >
      <>
        <SaveBar id="my-save-bar">
          <button variant="primary" onClick={handleSave2}></button>
          <button onClick={handleDiscard}></button>
        </SaveBar>
      </>

      <ModalConfirm
        id={"duplicate-modal"}
        text={"Are you sure you want to duplicate this gallery?"}
        contentBtn={"Duplicate"}
        handle={handleConfirmDuplicate}
      />

      <ModalConfirm
        id={"my-modal"}
        text={"Are you sure you want to delete this gallery"}
        contentBtn={"Delete"}
        handle={handleDelete}
      />

      <Form method="post" id="galleryForm" encType="multipart/form-data">
        <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="400">
          <BlockStack gap="400">
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <TextField
                  label="Name"
                  value={name}
                  autoComplete="off"
                  onChange={(value) => handleNameChange(value)}
                  name="name"
                />
                {isNewGallery ? (
                  <Uploader
                    handleFileUpload={handleFileUpload}
                    hotspots={hotspots}
                    gallery={gallery}
                    setSelectedHotspot={setSelectedHotspot}
                    previewImageUrl={previewImageUrl}
                    createRandomHotspot={createRandomHotspot}
                  />
                ) : null}
                {gallery.imageUrl && !isNewGallery && previewImageUrl && (
                  <Text as="h2" variant="headingMd">
                    File Name: {gallery.imageUrl}
                  </Text>
                )}
              </BlockStack>
            </Card>

            {!isNewGallery && (
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Media
                </Text>
                <GalleryImage
                  newHotspots={hotspots}
                  gallery={gallery}
                  setSelectedHotspot={setSelectedHotspot}
                  previewImageUrl={previewImageUrl}
                  createRandomHotspot={createRandomHotspot}
                />
              </BlockStack>
            )}
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
        {isNewGallery ? (
          <InlineStack align="end" gap="400">
            <Button
              submit
              loading={isSubmitting}
              onClick={handleSave}
              tone="primary"
              variant="primary"
            >
              {isNewGallery ? "Create Gallery" : "Save Gallery"}
            </Button>
          </InlineStack>
        ) : (
          <Divider />
        )}
        {!isNewGallery ? (
          <GalleryActions
            isNewGallery={isNewGallery}
            handleDelete={showModal}
            handleSave={handleSave}
          />
        ) : (
          <Divider />
        )}
      </Form>
    </Page>
  );
}

export default GalleryDetail;

function GalleryActions({ isNewGallery, handleDelete, handleSave }) {
  if (isNewGallery) return null;

  return (
    <InlineStack align="end" gap="400">
      <Button tone="critical" variant="primary" onClick={handleDelete}>
        Delete
      </Button>
      <Button onClick={handleSave}>Save</Button>
    </InlineStack>
  );
}
export const Uploader = ({
  handleFileUpload,
  hotspots,
  gallery,
  setSelectedHotspot,
  previewImageUrl,
  createRandomHotspot,
}) => {
  return (
    <>
      <Box>
        <label htmlFor="file-upload">
          <Text>Upload Image</Text>
          <DropZoneImage onFileUpload={handleFileUpload} />
        </label>
      </Box>

      <GalleryImage
        newHotspots={hotspots}
        gallery={gallery}
        setSelectedHotspot={setSelectedHotspot}
        previewImageUrl={previewImageUrl}
        createRandomHotspot={createRandomHotspot}
      />
    </>
  );
};

export const ModalConfirm = ({ id, text, contentBtn, handle }) => {
  return (
    <ui-modal id={id}>
      <p>{text}</p>
      <ui-title-bar title={`${contentBtn} Gallery`}>
        <button variant="primary" onClick={handle}>
          {contentBtn}
        </button>
        <button
          onClick={async () => {
            if (shopify?.modal?.hide) {
              await shopify.modal.hide(id);
            }
          }}
        >
          Cancel
        </button>
      </ui-title-bar>
    </ui-modal>
  );
};
