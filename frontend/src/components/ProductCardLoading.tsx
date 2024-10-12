import { Skeleton } from "./ui/skeleton";

const ProductCardSkeleton = ({ collection }: { collection?: boolean }) => {
  return (
    <div
      className={`flex flex-col w-full h-full max-w-sm gap-2 overflow-hidden rounded-lg shadow-lg`}
    >
      {/* Image Skeleton */}
      <div className={`${collection ? "h-60" : "h-64"} w-full`}>
        <Skeleton className="w-full h-full bg-gray-400 rounded-b-none" />
      </div>

      {/* Text and Price Skeleton */}
      <div className="flex flex-col justify-between p-4 space-y-3">
        {/* Title Skeleton */}
        <Skeleton className="w-full h-6 bg-gray-400 rounded-lg" />

        {/* Price and Button Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="w-1/3 h-4 bg-gray-400" />
          <Skeleton className="w-16 h-8 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
