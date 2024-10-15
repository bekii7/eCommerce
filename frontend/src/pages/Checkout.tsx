import useCartContext from "../hooks/useCartContext";
import { deliveryFee, fixLength, priceOfCart } from "../utils";
import { CartActions } from "../contexts/CartContext";
import { FiMinus } from "react-icons/fi";
import ConfirmBeforeAction from "../components/ConfirmBeforeAction";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { cn } from "../lib/utils";
import { ClipLoader } from "react-spinners";
import { Order } from "../types";
import DeliveryInfoForm from "../components/DeliveryInfoForm";
import { toast } from "react-toastify";
import { placeOrder, saveDeliveryInfo } from "../api";
import { useDeliveryInfoContext } from "../contexts/DeliveryInfoContext";

const CheckoutPage = () => {
  const { cartState, cartDispatch } = useCartContext();
  const navigate = useNavigate();

  // Using react-hook-form to handle delivery information form
  const methods = useForm<Order>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { triggerRefresh } = useDeliveryInfoContext();

  const onSubmit: SubmitHandler<Order> = async (data) => {
    try {
      const response = await placeOrder({
        body: { products: cartState.items, ...data },
      });

      if (data.deliveryInfo.saveInfo)
        await saveDeliveryInfo(data.deliveryInfo, triggerRefresh);

      if (response.status === 401) {
        navigate("/sign-in");
        throw new Error("You need to be signed in!");
      }

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message);
      }

      cartDispatch({ type: CartActions.CLEAR_CART, from: "placeOrder" });
      toast.success(
        "Order submitted successfully! You will receive an email with the order details."
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 xl:px-12 py-nav">
      <h1 className="text-2xl font-black md:text-3xl">Check Out</h1>
      <main className="relative grid w-full grid-cols-1 gap-y-6 xl:gap-x-6 py-4 max-w-[90vw] md:max-w-[75vw] xl:max-w-[90vw] md:px-6 xl:grid-cols-3">
        {/* Order Summary */}
        <section className="col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-lg font-bold md:text-xl">Order Summary</h2>
            <ConfirmBeforeAction
              title="Are you sure?"
              description="This will delete all the items in your cart. This action is not reversible!"
              onClick={() => {
                cartDispatch({ type: CartActions.CLEAR_CART });
              }}
              disabled={cartState.size == 0}
            >
              <span
                className={`px-2 text-red-700 disabled:text-gray-600 ${
                  cartState.size != 0 && "hover:text-red-600"
                }`}
              >
                Clear All
              </span>
            </ConfirmBeforeAction>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            {cartState.size == 0 ? (
              <div className="text-center">
                <p className="text-xl font-light">No items in cart</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[60%_15%_25%] text-base md:text-lg font-semibold">
                  <p>Item</p>
                  <p>Qty</p>
                  <p className="w-full text-start">Price</p>
                </div>
                {cartState.items.map((item) => (
                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    key={item.id}
                    className="grid grid-cols-[60%_15%_25%] cursor-pointer"
                  >
                    <div>
                      <p>{fixLength(item.name, 42)}</p>
                    </div>
                    <p className="w-full">{item.quantity}</p>
                    <div className="flex items-start justify-between">
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cartDispatch({
                            type: CartActions.REMOVE_ITEM,
                            payload: {
                              id: item.id,
                              quantity: item.quantity,
                              name: item.name,
                            },
                          });
                        }}
                      >
                        <FiMinus
                          size={24}
                          className="text-red-600 border-red-600 rounded-full hover:border-2"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="font-medium">Delivery Fee</p>
              <p className="font-medium">
                ${deliveryFee(priceOfCart(cartState.items)).toFixed(2)}
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold md:text-xl">
              <p>Total</p>
              <p>
                $
                {(
                  priceOfCart(cartState.items) +
                  deliveryFee(priceOfCart(cartState.items))
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Information */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col self-center w-full"
          >
            <h2 className="mb-4 text-lg font-bold md:text-xl">
              Delivery Information
            </h2>
            <DeliveryInfoForm className="w-full p-6 text-sm bg-white rounded-md shadow-md xl:p-4" />
            <button
              type="submit"
              className={cn(
                "relative flex items-center justify-center w-full px-4 py-2 mt-4 font-bold text-white bg-orange-500 rounded-md transition-all outline-none disabled:bg-orange-400",
                { "hover:bg-orange-600": !isSubmitting }
              )}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <ClipLoader
                  size={16}
                  color="white"
                  className="absolute left-4"
                />
              )}
              {isSubmitting ? "Ordering" : "Place Order"}
            </button>
          </form>
        </FormProvider>
      </main>
    </div>
  );
};

export default CheckoutPage;
