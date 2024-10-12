import { PulseLoader } from "react-spinners";

interface Category {
  id: number;
  name: string;
}

interface FiltersProps {
  categories: Array<Category>;
  categoriesLoading: boolean;
  categoriesError: boolean;
  refetchCategories: () => void;
  categorySearchTerm: string;
  setCategorySearchTerm: (term: string) => void;
  selectedCategory: number | null;
  setSelectedCategory: (categoryId: number | null) => void;
  minPrice: number | null;
  setMinPrice: (price: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (price: number | null) => void;
  discountOnly: boolean;
  setDiscountOnly: (value: boolean) => void;
  sheetControl?: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  categoriesLoading,
  categoriesError,
  refetchCategories,
  categorySearchTerm,
  setCategorySearchTerm,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  discountOnly,
  setDiscountOnly,
  sheetControl,
}) => {
  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-col gap-0 mb-4">
        <h3 className="font-semibold">Category</h3>
        <input
          type="text"
          placeholder="Search categories"
          value={categorySearchTerm}
          onChange={(e) => setCategorySearchTerm(e.target.value)}
          className="w-full px-2.5 py-1.5 mb-1 text-sm border border-gray-300 rounded outline-none focus:border-orange-600 duration-200"
        />
        <button
          className={`self-end text-xs duration-200 outline-none md:text-sm ${
            selectedCategory == null ? "" : "text-orange-600"
          }`}
          onClick={() => setSelectedCategory(null)}
          disabled={selectedCategory === null}
        >
          Clear
        </button>

        {categoriesLoading ? (
          <div className="flex items-center justify-center">
            <PulseLoader color="#f97316" size={10} />
          </div>
        ) : categoriesError ? (
          <div className="text-sm text-center text-red-600">
            <p>Failed to load categories.</p>
            <button
              onClick={refetchCategories}
              className="mt-2 text-orange-500 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <ul className="p-3 space-y-2 overflow-y-auto bg-white border border-gray-200 rounded-md h-72">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category: Category) => (
                <li
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    sheetControl && sheetControl();
                  }}
                  className={`cursor-pointer px-4 py-2 rounded text-sm duration-200 ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No categories found</li>
            )}
          </ul>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-semibold">Price</h3>
        <div className="flex items-center space-x-2 text-sm">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full px-2 py-1 duration-200 border border-gray-300 rounded outline-none focus:border-orange-600"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full px-2 py-1 duration-200 border border-gray-300 rounded outline-none focus:border-orange-600"
          />
        </div>
      </div>

      {/* Discount Filter */}
      <div className="mb-6">
        <h3 className="font-semibold">Discount</h3>
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => {
              setDiscountOnly(e.target.checked);
              sheetControl && sheetControl();
            }}
            className="form-checkbox"
          />
          <span>Sale</span>
        </label>
      </div>
    </>
  );
};

export default Filters;
