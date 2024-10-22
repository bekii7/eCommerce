import { IoIosSearch } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useSearchHandler } from "../hooks/useSearchHandler";
import { cn } from "../lib/utils";
import { useState } from "react";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sheetControl?: () => void;
  className?: string;
}

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  onSubmit,
  sheetControl,
  className,
}: SearchInputProps) => {
  return (
    <form
      className={cn(`relative flex items-center`, className)}
      onSubmit={onSubmit}
    >
      {/* Input field */}
      <input
        type="text"
        name="search"
        id="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="py-2 pl-6 pr-2 font-light transition-all border-gray-400 outline-none cursor-pointer lg:w-[16rem] xl:w-[24rem] rounded-s-full placeholder:text-black focus:cursor-auto border-s border-y focus:border-orange-400 peer"
        placeholder="Search"
      />

      {/* "X" Button to Clear Input */}
      {searchQuery && (
        <button
          type="button"
          className="absolute right-[3rem] p-1 text-gray-500 hover:text-orange-600 outline-none duration-300"
          onClick={() => setSearchQuery("")}
        >
          <IoIosClose size={32} />
        </button>
      )}

      {/* Submit/Search Button */}
      <button
        type="submit"
        className="bg-white py-2 pl-2.5 pr-4 border-e border-y border-gray-400 peer-focus:border-orange-400 transition-all rounded-e-full"
        onClick={sheetControl}
      >
        <IoIosSearch size={24} />
      </button>
    </form>
  );
};

// Desktop Search Component
export const Search = () => {
  const { searchQuery, setSearchQuery, handleSubmit } = useSearchHandler();

  return (
    <SearchInput
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSubmit={handleSubmit}
      className="hidden md:flex"
    />
  );
};

// Mobile Search Component
export const SearchSmall = () => {
  const { searchQuery, setSearchQuery, handleSubmit } = useSearchHandler();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex md:hidden">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger className="p-2 border border-gray-300 rounded-full shadow-md">
          <IoIosSearch size={28} />
        </SheetTrigger>
        <SheetContent
          side="top"
          hideClose
          className="bg-white bg-opacity-75"
          aria-describedby=""
        >
          <SheetTitle className="hidden">Search</SheetTitle>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSubmit}
            className="justify-center w-full"
            sheetControl={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const SearchDefault = ({
  className,
  sheetControl,
}: {
  className?: string;
  sheetControl?: () => void;
}) => {
  const { searchQuery, setSearchQuery, handleSubmit } = useSearchHandler();

  return (
    <SearchInput
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSubmit={handleSubmit}
      sheetControl={sheetControl}
      className={cn("self-center px-6", className)}
    />
  );
};
