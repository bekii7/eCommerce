import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";

import DefaultLayout from "./layouts/DefaultLayout";
import SignLayout from "./layouts/SignLayout";

import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import CheckoutPage from "./pages/Checkout";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import ProductDetailsPage from "./pages/ProductDetails";
import CustomOrderPage from "./pages/CustomOrder";
import BrowsePage from "./pages/Browse";

import AuthErrorPage from "./pages/AuthError";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="/" element={<SignLayout />}>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<BrowsePage />} />
          <Route path="/logout" element={<Navigate to="/" replace />} />
          <Route path="/custom-order" element={<CustomOrderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/auth-error" element={<AuthErrorPage />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
