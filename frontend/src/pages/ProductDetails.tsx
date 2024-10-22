import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import useCartContext from "../hooks/useCartContext";
import { CartActions } from "../contexts/CartContext";
import { handleMouseMove, handleMouseLeave } from "../utils";
import { PulseLoader, ClipLoader } from "react-spinners";
import ErrorMessage from "../components/ErrorMessage";
import { getProductDetails } from "../api";

interface Data {
  id: string;
  name: string;
  price: string;
  images: Array<string>;
  description: string;
  stock_quantity: number;
  stock_status: string;
  average_rating: string;
  related_ids: Array<number>;
  tags: Array<{ id: number; name: string }>;
  attributes: Array<{ id: number; name: string; options: Array<string> }>;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: string;
  images: Array<string>;
}

const ProductDetailsPage = () => {
  let { id } = useParams();
  const { cartDispatch } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // State to handle the zoom reference
  const zoomRef = useRef<HTMLDivElement | null>(null);

  // Fetch product details using useQuery
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
    refetch: refetchProduct,
  } = useQuery<Data, Error>(
    ["productDetails", id],
    async () => {
      const response = await getProductDetails(id);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setSelectedImage(data.images[0]); // Set first image as default
      },
    }
  );

  // Fetch related products using useQuery
  const {
    data: relatedProducts,
    isLoading: relatedLoading,
    error: relatedError,
    refetch: refetchRelated,
  } = useQuery<RelatedProduct[], Error>(
    ["relatedProducts", productData?.related_ids],
    async () => {
      if (!productData?.related_ids) return [];
      const relatedProductsData: RelatedProduct[] = await Promise.all(
        productData.related_ids.map(async (relatedId) => {
          const response = await getProductDetails(relatedId);
          if (!response.ok) {
            throw new Error("Failed to fetch a related product");
          }
          return response.json();
        })
      );
      return relatedProductsData;
    },
    {
      enabled: !!productData, // Fetch related products only if productData is available
    }
  );

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-navOffset">
        <PulseLoader color="#f97316" size={20} />
      </div>
    );
  }

  return (
    <div className="py-nav min-h-navOffsetLg">
      <div className="mx-auto max-w-[90vw] sm:max-w-[85vw] flex flex-col items-center justify-center h-full">
        {/* Product Error Handling */}
        {productError ? (
          <ErrorMessage
            title="Failed to Load Product"
            description={productError.message}
            retry={refetchProduct}
            className="w-fit"
          />
        ) : (
          productData && (
            <div className="p-4 shadow-lg bg-white sm:p-6 md:p-12 w-fit max-w-[95vw]">
              <div className="flex flex-col gap-6 md:gap-12 md:flex-row">
                {/* Left: Image Section */}
                <div className="flex-1 max-w-xl min-w-[20rem]">
                  {selectedImage && (
                    <div className="relative w-full mb-4 overflow-hidden shadow-lg min-h-72">
                      {/* Container for the zoom effect */}
                      <div
                        className="relative w-full h-full overflow-hidden cursor-zoom-in"
                        onMouseMove={(e) =>
                          handleMouseMove(e, selectedImage, zoomRef)
                        }
                        onMouseLeave={() => handleMouseLeave(zoomRef)}
                      >
                        {/* Original Image Displayed */}
                        <img
                          src={selectedImage}
                          alt={productData.name}
                          className="object-cover w-full h-full"
                        />

                        {/* Zoom Lens (hidden initially) */}
                        <div
                          className="absolute top-0 left-0 hidden w-32 h-32 bg-no-repeat bg-cover border border-gray-300 rounded-full sm:w-64 sm:h-64"
                          ref={zoomRef}
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Thumbnails List */}
                  <div className="flex gap-4 overflow-x-auto">
                    {productData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={productData.name}
                        className={`w-32 h-32 cursor-pointer object-cover border-4 transition-all ${
                          selectedImage === image
                            ? "border-orange-500"
                            : "border-transparent"
                        }`}
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Product Info Section */}
                <div className="flex flex-col flex-1">
                  <div className="mb-4">
                    <h2 className="mb-2 text-xl font-medium sm:text-2xl md:text-3xl">
                      {productData.name}
                    </h2>
                    <p className="mb-2 text-lg font-bold text-orange-500 md:text-2xl">
                      ${productData.price}
                    </p>
                    <p
                      className={`mb-2 ${
                        productData.stock_status === "instock"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {productData.stock_status === "instock"
                        ? `Available`
                        : "Out of Stock"}
                    </p>
                  </div>

                  {/* Size Select */}
                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="color" className="mr-2">
                      Color:
                    </label>
                    <select
                      id="color"
                      value={selectedColor || ""}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 outline-none"
                    >
                      {productData.attributes
                        .find((attr) => attr.name === "Color")
                        ?.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Size Select */}
                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="size" className="mr-2">
                      Size:
                    </label>
                    <select
                      id="size"
                      value={selectedSize || ""}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 outline-none"
                    >
                      {productData.attributes
                        .find((attr) => attr.name === "Size")
                        ?.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="flex items-center py-3 mb-4 border-y">
                    <label htmlFor="quantity" className="mr-2 text-lg">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      min={1}
                      max={productData.stock_quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        if (quantity === 0 || !quantity) setQuantity(1);
                        cartDispatch({
                          type: CartActions.ADD_ITEM,
                          payload: {
                            ...productData,
                            quantity:
                              quantity === 0 || !quantity ? 1 : quantity,
                            id: id,
                          },
                        });
                      }}
                      className="px-4 py-2 text-sm text-white bg-orange-500 rounded-full text0center"
                      disabled={productData.stock_quantity === 0}
                    >
                      {productData.stock_quantity === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>
                    <Link
                      to="/checkout"
                      className="px-4 py-2 text-sm text-center text-white bg-orange-500 rounded-full"
                    >
                      Go to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Related Products Section */}
        {!relatedLoading &&
          !relatedError &&
          relatedProducts &&
          relatedProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-bold">Related Products</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    to={`/product/${relatedProduct.id}`}
                    key={relatedProduct.id}
                    className="block p-4 bg-white rounded-lg shadow hover:shadow-lg"
                  >
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="object-cover w-full h-40 mb-2"
                    />
                    <p className="text-lg font-medium text-center">
                      {relatedProduct.name}
                    </p>
                    <p className="text-lg font-bold text-center text-orange-500">
                      ${relatedProduct.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* Related Products Loading/Error Handling */}
        {relatedLoading && (
          <div className="flex items-center justify-center h-40">
            <ClipLoader color="#f97316" size={30} />
          </div>
        )}

        {relatedError && (
          <ErrorMessage
            title="Failed to Load Related Products"
            description={relatedError.message}
            retry={refetchRelated}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
