import Gallery from "app/models/gallery.server";
import { create } from "domain";

const GET_PRODUCTS = ` 
query {
  products(first: 10) {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
}
`
export const getGalleries = async () => {
  const galleries = await Gallery.find({}).sort({ createdAt: -1 });
  return galleries;
};
export async function getGalleryById(id: string) {
  return await Gallery.findById(id);
}

export const getProduct = async ({ admin }: any) => {
  try {
    const response = await admin.graphql(GET_PRODUCTS);
    const data = await response.json();
    return data.data.products.edges;
  } catch (error) {
    console.error("Error in queryImages:", error);
    throw error;
  }
};


export const updateGallery = async (id: string, data: any) => {
  return await Gallery.findByIdAndUpdate(id, data, { new: true });
};
export const createGallery = async (data: any) => {
  return await Gallery.create(data);
};

export const deleteGallery = async (id: string) => {
  return await Gallery.findByIdAndDelete(id);
};

export const duplicateGallery = async (id: string) => {
  const gallery = await getGalleryById(id);
  const data = {
    name: `Copy of ${gallery.name}`,
    imageUrl: gallery.imageUrl,
    hotspots: gallery.hotspots,
  }
  const newGallery = await createGallery(data);
  return newGallery;
};