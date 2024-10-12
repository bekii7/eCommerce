// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartContextProvider } from "./contexts/CartContext";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <CartContextProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
        theme={"colored"}
        limit={2}
        hideProgressBar
        closeOnClick
        newestOnTop
        toastStyle={{
          backgroundColor: "#1f2937",
          border: "1.5px solid #6b7280",
        }}
        toastClassName={"h-min text-sm font-light tracking-wide"}
        bodyClassName={"flex gap-1"}
        closeButton={false}
        draggable
      />
    </CartContextProvider>
  </QueryClientProvider>
  // </StrictMode>
);
