// Ensures every product has both .id and ._id pointing to the MongoDB ObjectId
export const normalizeProduct = (product) => ({
    ...product,
    _id: product._id,
    id: product._id,   // override any fake "shoe-3" id
});

export const normalizeProducts = (products) => products.map(normalizeProduct);