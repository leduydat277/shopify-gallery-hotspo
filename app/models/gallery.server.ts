import mongoose, { Schema, Document, Model } from "mongoose";

interface IHotspot {
    productId: string;
    productUrl: string;
    productName?: string;
    productImage?: string;
    x: number;
    y: number;
    createdAt?: Date;
}

interface IGallery extends Document {
    name: string;
    imageUrl: string;
    hotspots: IHotspot[];
    createdAt?: Date;
}

const hotspotSchema = new Schema<IHotspot>({
    productId: { type: String, required: true },
    productUrl: { type: String, required: true },
    productName: { type: String },
    productImage: { type: String },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const gallerySchema = new Schema<IGallery>({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    hotspots: [hotspotSchema],
    createdAt: { type: Date, default: Date.now },
});

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", gallerySchema);

export default Gallery;
