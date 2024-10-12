import { useQuery } from "react-query";
import ProductCard from "./ProductCard";
import ProductCardLoading from "./ProductCardLoading";
import ErrorMessage from "./ErrorMessage";
import { getNewCollectionProducts } from "../api";

interface Product {
  id: string;
  images: Array<string>;
  name: string;
  price: string;
}

const Collections = () => {
  const fetchNewCollectionProducts = async () => {
    const response = await getNewCollectionProducts();
    const result = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    return result; // Return the result to be cached
  };
  // useQuery for fetching and caching products
  const {
    data: products = [], // Default to an empty array if data is undefined
    isLoading: productsLoading,
    isError,
    refetch, // This function allows us to refetch the data when needed
  } = useQuery(
    "newCollectionProducts", // Query key to uniquely identify this query
    fetchNewCollectionProducts,
    {
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    }
  );

  return (
    <div className="flex flex-col items-center gap-4 px-4 lg:pl-6">
      {/* Header for the collection */}
      <h1 className="w-full py-2 font-semibold tracking-widest text-center uppercase rounded-lg bg-orange-light">
        Our New Collection
      </h1>

      {/* Products Grid */}
      <div className="grid w-full grid-cols-1 gap-6 pb-4 justify-items-center sm:grid-cols-2 xl:grid-cols-4 min-h-64">
        {/* Show loading skeletons when products are loading */}
        {productsLoading &&
          [...Array(4)].map((_, idx) => (
            <ProductCardLoading key={idx} collection />
          ))}

        {/* Show a styled error message when fetching fails */}
        {isError && (
          <ErrorMessage
            title="Oops! Something went wrong."
            description="We couldn't load the new collection at the moment. Please check
              your connection or try again later."
            className="col-span-full"
            retry={refetch}
          />
        )}

        {/* Show products when data is successfully loaded */}
        {!productsLoading &&
          !isError &&
          products.map((product: Product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              img={product.images[0]}
              title={product.name}
              price={product.price}
              quantity={1}
              collection
            />
          ))}
      </div>
    </div>
  );
};

export default Collections;
