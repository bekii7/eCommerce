mn
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useDotButton,
  type CarouselApi,
} from "./ui/carousel";
import { useQuery } from "react-query";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import { FadeLoader } from "react-spinners";
import { getTrendingProducts } from "../api";

interface Product {
  id: string;
  images: Array<string>;
  name: string;
  price: string;
}

const TrendingItems = () => {
  const fetchTrendingProducts = async () => {
    const response = await getTrendingProducts();
    if (!response.ok) {
      throw new Error("Failed to fetch trending products");
    }
    const result = await response.json();
    return Object.values(result);
  };

  // Fetch trending products using react-query
  const {
    data: products = new Array<Product>(),
    isLoading,
    isError,
    refetch,
  } = useQuery(["trendingProducts"], fetchTrendingProducts, {
    staleTime: 300000, // 5 minutes caching
    cacheTime: 900000, // 15 minutes cache storage
  });

  // Carousel setup
  const [api, setApi] = useState<CarouselApi>();
  const onNavButtonClick = useCallback((emblaApi: CarouselApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    api,
    onNavButtonClick
  );

  return (
    <div className="flex items-center py-nav max-lg:flex-col max-lg:gap-8 sm:px-4 sm:pl-6">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
        ]}
        opts={{
          loop: true,
        }}
        className="relative flex flex-col w-11/12 cursor-pointer md:w-3/4 lg:w-1/2 min-h-80 rounded-2xl"
      >
        {/* Navigation Arrows */}
        <div className="absolute z-20 mx-2 -translate-y-1/2 top-1/2">
          <CarouselPrevious />
        </div>
        <div className="absolute right-0 z-20 mx-2 -translate-y-1/2 top-1/2">
          <CarouselNext />
        </div>

        {/* Carousel Content */}
        <CarouselContent>
          {isLoading ? (
            // Loading State
            <CarouselItem>
              <div className="flex items-center justify-center w-full bg-gray-200 h-96 rounded-2xl">
                <FadeLoader />
              </div>
            </CarouselItem>
          ) : isError ? (
            // Error State
            <CarouselItem>
              <div
                className="flex items-center justify-center w-full text-lg text-red-600 bg-gray-200 h-96 rounded-2xl"
                onClick={() => refetch()}
              >
                <span className="text-center max-w-72">
                  Failed to load trending products. Click to try again.
                </span>
              </div>
            </CarouselItem>
          ) : products.length === 0 ? (
            // Empty State
            <CarouselItem>
              <div className="flex flex-col items-center justify-center w-full gap-2 text-center bg-gray-200 h-96 rounded-2xl">
                <span className="text-lg font-bold">No trending items :(</span>
                <span className="text-sm font-medium sm:text-base">
                  Please come back later!
                </span>
              </div>
            </CarouselItem>
          ) : (
            // Loaded State
            products.map((product: any) => (
              <CarouselItem key={product.id}>
                <Link to={`product/${product.id}`} className="relative group">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full shadow-lg rounded-2xl h-96 2xl:h-[32rem]"
                  />
                  {/* Product Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-sm text-center text-white transition duration-300 bg-gray-900 bg-opacity-50 rounded-b-2xl group-hover:bg-opacity-90 md:text-base">
                    {product.name}
                  </div>
                </Link>
              </CarouselItem>
            ))
          )}
        </CarouselContent>

        {/* Carousel Dots */}
        <div className="flex self-center gap-2 mt-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`w-2 h-2 rounded-full duration-500 outline-none ${
                index === selectedIndex
                  ? "bg-orange-500 scale-125"
                  : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </Carousel>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-8 lg:items-end lg:w-1/2 lg:pr-16 max-lg:py-6">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">Trending Items</h1>
        <p className="w-4/5 font-light text-center lg:text-end">
          Discover the latest trends in fashion with our exclusive collection.
          Whether you're looking for casual elegance or bold statements, we have
          something for everyone.
        </p>
        <a
          href="#products"
          className="px-4 py-2 text-sm rounded-lg cursor-pointer bg-btn-green"
        >
          Explore more
        </a>
      </div>
    </div>
  );
};

export default TrendingItems;
