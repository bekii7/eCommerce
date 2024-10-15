import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { PulseLoader } from "react-spinners";
import { FiFilter } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "../components/ui/sheet";
import { cleanString } from "../utils";
import { SearchDefault } from "../components/Search";
import Filters from "../components/Filters";
import ErrorMessage from "../components/ErrorMessage";
import { getProducts, getCategories } from "../api";

interface Product {
  id: string;
  name: string;
  price: string;
  discount: number;
  images: Array<string>;
  category: { id: string; name: string };
}

interface Category {
  id: number;
  name: string;
}

const BrowsePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");

  // Fetch products based on search term and filters
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useQuery(
    [
      "searchProducts",
      searchTerm,
      selectedCategory,
      minPrice,
      maxPrice,
      discountOnly,
    ],
    async () => {
      let query = `search=${searchTerm}`;
      if (selectedCategory) query += `&category=${selectedCategory}`;
      if (minPrice !== null) query += `&min_price=${minPrice}`;
      if (maxPrice !== null) query += `&max_price=${maxPrice}`;
      if (discountOnly) query += `&on_sale=true`;
      const response = await getProducts({ query });
      if (!response.ok) throw new Error("Failed to fetch products.");
      return response.json();
    },
    { enabled: !!searchTerm || selectedCategory != null } // Only run query if searchTerm exists
  );

  // Fetch categories for the filter
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useQuery("categories", async () => {
    const response = await getCategories();
    const data = await response.json();
    return data.map((category: Category) => ({
      ...category,
      name: cleanString(category.name),
    }));
  });

  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="relative flex flex-col divide-x-2 xl:flex-row min-h-navOffset">
      {/* For Mobile: Trigger Button to Open Filters in a Sheet */}
      <div className="w-full px-4 py-3 xl:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-md outline-none">
            <FiFilter size={20} />
            <span>Filters</span>
          </SheetTrigger>
          <SheetContent
            aria-describedby=""
            side="left"
            className="flex flex-col max-w-xs py-12 overflow-x-hidden overflow-y-auto bg-white outline-none"
          >
            <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
            <SearchDefault sheetControl={() => setSheetOpen(false)} />

            <Filters
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError}
              refetchCategories={refetchCategories}
              categorySearchTerm={categorySearchTerm}
              setCategorySearchTerm={setCategorySearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              discountOnly={discountOnly}
              setDiscountOnly={setDiscountOnly}
              sheetControl={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Left Side: Filters for Desktop */}
      <div className="hidden xl:block sticky w-1/3 px-6 py-4 top-[4.65rem] h-navOffset overflow-y-auto">
        <h2 className="mb-4 text-xl font-bold">Filters</h2>
        <Filters
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          refetchCategories={refetchCategories}
          categorySearchTerm={categorySearchTerm}
          setCategorySearchTerm={setCategorySearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          discountOnly={discountOnly}
          setDiscountOnly={setDiscountOnly}
        />
      </div>

      {/* Right Side: Products List */}
      <div className="w-full h-full px-6 py-4">
        {productsLoading ? (
          <div className="flex items-center justify-center h-full">
            <PulseLoader color="#f97316" size={15} />
          </div>
        ) : productsError ? (
          <div className="flex items-center justify-center h-full -translate-y-12">
            <ErrorMessage
              title="Failed to Load Products"
              description="Please
            check your internet connection or try again later."
              retry={refetchProducts}
            />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                img={product.images[0]}
                price={product.price}
                quantity={1}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl font-semibold text-gray-500">
              {!searchTerm && !selectedCategory
                ? "Search for products or select a category"
                : "No products found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
