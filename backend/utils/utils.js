const ProductsProp = [
  "id",
  "name",
  "slug",
  // "permalink",
  "price",
  "categories",
  "tags",
  "images",
  // "attributes",
];

const ProductProp = [
  "id",
  "name",
  "slug",
  // "permalink",
  "price",
  "categories",
  "tags",
  "images",
  "description",
  "stock_status",
  "stock_quantity",
  "average_rating",
  "related_ids",
  "attributes",
];

const CategoryProp = ["id", "name", "slug", "description", "image"];

export const filterProductsData = (data, filter = ProductsProp) => {
  // modify the images prop to be a list of srcs
  data.forEach((item) => {
    item.images = item.images.map((img) => img.src);
  });

  // filter only the required props and return
  return data.map((item) =>
    Object.fromEntries(
      Object.entries(item).filter(([key]) => filter.includes(key))
    )
  );
};

export const filterProductData = (data, filter = ProductProp) => {
  // modify the images prop to be a list of srcs
  data.images = data.images.map((img) => img.src);

  // filter only the required props and return
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => filter.includes(key))
  );
};

export const filterCategoryData = (data, filter = CategoryProp) => {
  return data.map((item) =>
    Object.fromEntries(
      Object.entries(item).filter(([key]) => filter.includes(key))
    )
  );
};

export const filterOrderData = (data, filter) => {
  return data.map((item) =>
    Object.fromEntries(
      Object.entries(item).filter(([key]) => filter.includes(key))
    )
  );
};
