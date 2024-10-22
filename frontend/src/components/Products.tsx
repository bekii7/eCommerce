import { useState } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import ProductCard from "./ProductCard";
import ProductCardLoading from "./ProductCardLoading";
import { cleanString } from "../utils";
import { ClipLoader } from "react-spinners";
import ErrorMessage from "./ErrorMessage";
import { getCategories, getProducts } from "../api";

interface Product {
  id: string;
  name: string;
  price: string;
  images: Array<string>;
  category: { id: string | null; name: string };
}

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const active = "bg-orange-400 text-white";
  const inActive = "bg-white hover:bg-orange-400 hover:text-white";

  // Fetch categories using useQuery (cached)
  const { data: categories = [] } = useQuery(
    "categoriesH",
    async () => {
      const response = await getCategories();
      const result = await response.json();

      return [
        { id: null, name: "All" },
        ...result
          .filter((category: any) => category.name !== "Uncategorized")
          .map((category: any) => ({
            id: category.id,
            name: cleanString(category.name),
          })),
      ];
    },
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  // Fetch products using useInfiniteQuery for pagination
  const {
    data: productPages,
    isLoading: productsLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch, // Refetch function to retry loading products
  } = useInfiniteQuery(
    ["productsH", activeCategory],
    async ({ pageParam = 1 }) => {
      let query = `page=${pageParam}&per_page=${PRODUCTS_PER_PAGE}`;
      if (activeCategory) {
        query += `&category=${activeCategory}`;
      }
      const response = await getProducts({ query });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return await response.json();
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === PRODUCTS_PER_PAGE
          ? allPages.length + 1
          : undefined;
      },
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  // Handle category filter
  const handleCategoryFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };

  // Load more products function
  const loadMoreProducts = () => {
    fetchNextPage();
  };

  return (
    <div id="products" className="relative p-6 overflow-hidden">
      {/* Category Filter Buttons */}
      <div className="flex items-center gap-4 overflow-x-auto border-b-2 md:self-start text-nowrap lg:pb-1">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-6 py-1.5 mb-3 font-light w-max rounded-md shadow-md ${
              activeCategory === category.id ? active : inActive
            }`}
            onClick={() => handleCategoryFilter(category.id)}
            disabled={activeCategory === category.id}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Error State Handling */}
      {isError && (
        <ErrorMessage
          title="Oops! Something went wrong."
          description="Sorry, we are unable to display the products at the moment. Please
            check your internet connection or try again later."
          retry={refetch}
        />
      )}

      {!productsLoading &&
        !isError &&
        productPages?.pages.flat().length === 0 && (
          <div className="flex flex-col items-center justify-center w-full gap-1 p-6 mt-4 bg-gray-200 border border-gray-300 rounded-lg min-h-64">
            <span className="text-lg font-bold sm:text-xl">
              No products available :(
            </span>
            <span className="text-sm font-medium sm:text-base">
              Please come back later!
            </span>
          </div>
        )}

      {/* Products Grid */}
      {!isError && (
        <>
          <div className="flex items-center justify-center">
            <div className="grid items-center w-full grid-cols-1 gap-8 py-4 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
              {productsLoading &&
                [...Array(PRODUCTS_PER_PAGE)].map((_, idx) => (
                  <ProductCardLoading key={idx} />
                ))}

              {/* Display products */}
              {!productsLoading &&
                productPages?.pages
                  .flat()
                  .map((item: Product) => (
                    <ProductCard
                      key={item.id}
                      id={item.id}
                      title={item.name}
                      img={item.images[0]}
                      price={item.price}
                      quantity={1}
                    />
                  ))}
            </div>
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                className={`px-6 py-3 font-medium text-white bg-orange-500 rounded-full transition-all ${
                  !isFetchingNextPage && "hover:bg-orange-600"
                }`}
                onClick={loadMoreProducts}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center justify-between gap-2">
                    <ClipLoader size={20} color="white" />
                    <span>Loading ...</span>
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
