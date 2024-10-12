import { Outlet, ScrollRestoration } from "react-router-dom";

import { SideBar } from "../components/SideBar";
import MainContent from "../components/MainContent";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { DeliveryInfoProvider } from "../contexts/DeliveryInfoContext";

const DefaultLayout = () => {
  return (
    <DeliveryInfoProvider>
      <main className="relative flex min-h-screen bg-bg">
        <SideBar />
        <MainContent>
          <NavBar />

          <Outlet />
          <Footer />
          <ScrollRestoration />
        </MainContent>
      </main>
    </DeliveryInfoProvider>
  );
};

export default DefaultLayout;
