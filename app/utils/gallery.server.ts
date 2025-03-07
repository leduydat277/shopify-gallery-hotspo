import Gallery from "app/models/gallery.server";

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



