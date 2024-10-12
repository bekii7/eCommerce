import { SideBarMobile } from "./SideBar";
import { NavLinks, NavLinksMobile } from "./NavLinks";
import { Search, SearchSmall } from "./Search";

const NavBar = () => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 md:py-4 lg:pl-6 bg-bg max-md:shadow-nav">
      <div className="flex items-center gap-2">
        <SideBarMobile />
        <Search />
        <SearchSmall />
      </div>
      <NavLinks />
      <NavLinksMobile />
    </div>
  );
};

export default NavBar;
