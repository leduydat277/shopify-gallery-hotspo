import { Form } from "@remix-run/react";
import fs from "fs/promises";
import path from "path";
import {
    ActionFunctionArgs,

} from "@remix-run/node";
import Gallery from "app/models/gallery.server";
import { dir } from "console";

export const action = async ({ request }: ActionFunctionArgs) => {
    // await connectDB();

    try {
        const uploadDir = path.resolve("public/uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        const formData = await request.formData();
        const file = formData.get("file");
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

        return window.location.href = "/app";
    } catch (error) {
        console.error("❌ Lỗi khi ghi file:", error);
        return { success: false, error: error.message };
    }
};

export default function UploadPage() {
    return (
        <Form method="post" encType="multipart/form-data">
            <label>
                Gallery Name:
                <input type="text" name="name" required />
            </label>
            <br />
            <label>
                Upload Image:
                <input
                    type="file"
                    name="file"
                    required
                    onChange={(e) => console.log("📂 File selected:", e.target.files[0])}
                />
            </label>
            <br />
            <button type="submit">Upload</button>
        </Form>
    );
}
