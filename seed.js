// Kết nối MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv";

import Gallery from "./app/models/gallery.server.ts";
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    const newGallery = new Gallery({
      name: "Sample Gallery",
      imageUrl: "/uploads/sample-banner.jpg",
      hotspots: [
        {
          productId: "123",
          productUrl: "/products/sample-product",
          productName: "Sample Product",
          productImage: "/uploads/sample-product.jpg",
          x: 100,
          y: 150,
        },
      ],
    });

    await newGallery.save();
    console.log("Gallery added!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedData();
