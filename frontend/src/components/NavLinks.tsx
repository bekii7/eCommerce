import { Link } from "react-router-dom";

import { FiMenu } from "react-icons/fi";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const links = [
  { name: "Home", path: "" },
  { name: "Browse", path: "/products" },
  { name: "Custom Order", path: "/custom-order" },
  { name: "About", path: "/about" },
];

export const NavLinks = () => {
  return (
    <div className="items-center hidden gap-6 px-20 lg:flex xl:gap-16">
      {links.map((link, idx) => (
        <Link
          key={idx}
          to={link.path}
          className="font-light transition-all hover:text-orange-600"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export const NavLinksMobile = () => {
  return (
    <div className="flex lg:hidden">
      <Sheet>
        <SheetTrigger className="outline-none">
          <FiMenu size={24} />
        </SheetTrigger>
        <SheetContent
          aria-describedby=""
          className="outline-none bg-bg max-w-80"
        >
          <SheetTitle className="hidden">Menu</SheetTitle>
          <div className="flex flex-col items-end">
            {links.map((link, idx) => (
              <SheetClose key={idx} asChild>
                <Link
                  to={link.path}
                  className="py-6 text-2xl font-medium transition-all hover:text-orange-600"
                >
                  {link.name}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
