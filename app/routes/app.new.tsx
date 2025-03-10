import { Form, useActionData } from "@remix-run/react";
import fs from "fs/promises";
import path from "path";
import { ActionFunctionArgs, redirect, json } from "@remix-run/node";
import {
    DropZone,
    LegacyStack,
    Thumbnail,
    Text,
    TextField,
    Button,
    Page,
    Card,
    Toast,
    Frame,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import Gallery from "app/models/gallery.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const uploadDir = path.resolve("public/uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name");

        if (!file || !(file instanceof File)) {
            throw new Error("❌ Không có file nào được upload!");
        }

        const filePath = path.join(uploadDir, file.name);
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

        const newGallery = new Gallery({
            name,
            imageUrl: `/uploads/${file.name}`,
            hotspots: [],
        });

        await newGallery.save();

        return json({ success: true, message: "Upload thành công!" });
    } catch (error) {
        console.error("❌ Lỗi khi ghi file:", error);
        return json({ success: false, error: error.message });
    }
};

export default function UploadPage() {
    const [galleryName, setGalleryName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [showToast, setShowToast] = useState(false);
    const actionData = useActionData<typeof action>();

    useCallback(() => {
        if (actionData?.success) {
            setShowToast(true);
        }
    }, [actionData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    return (
        <Frame>
            <Page title="Upload Gallery">
                <Card sectioned>
                    <Form method="post" encType="multipart/form-data">
                        <TextField
                            label="Gallery Name"
                            value={galleryName}
                            onChange={setGalleryName}
                            autoComplete="off"
                            name="name"
                            required
                        />

                        <br />

                        <label htmlFor="file-upload">
                            <Text>Upload Image</Text>
                            <input
                                id="file-upload"
                                type="file"
                                name="file"
                                accept="image/*"
                                required
                                onChange={handleFileChange}
                                style={{ display: "block", marginBottom: "1rem" }}
                            />
                        </label>

                        {file && (
                            <LegacyStack vertical>
                                <Thumbnail
                                    size="large"
                                    alt={file.name}
                                    source={URL.createObjectURL(file)}
                                />
                                <Text>
                                    File selected: {file.name} ({(file.size / 1024).toFixed(2)}{" "}
                                    KB)
                                </Text>
                            </LegacyStack>
                        )}

                        <br />
                        <Button submit primary>
                            Upload
                        </Button>
                    </Form>
                </Card>

                {showToast && (
                    <Toast
                        content={actionData?.message || "Upload thành công!"}
                        onDismiss={() => setShowToast(false)}
                    />
                )}
            </Page>
        </Frame>
    );
}
