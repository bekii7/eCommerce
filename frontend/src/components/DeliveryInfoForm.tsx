import { useFormContext } from "react-hook-form";
import { CustomOrder, Order } from "../types";

import SavedDeliveryInfo from "./SavedDeliveryInfo/Info";
import SaveDeliveryInfoCheckbox from "./SavedDeliveryInfo/Checkbox";
import { cn } from "../lib/utils";

const DeliveryInfoForm = ({ className }: { className?: string }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CustomOrder | Order>();

  return (
    <div className={cn("", className)}>
      <div className="">
        <SavedDeliveryInfo />
        <label
          htmlFor="fullName"
          className="block font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          {...register("deliveryInfo.fullName", {
            required: "Full Name is required",
          })}
          placeholder="Enter your full name"
          className="block w-full px-4 py-2 mt-1 duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
        />
        {errors.deliveryInfo?.fullName && (
          <p className="text-xs text-red-500 mt-0.5 font-light">
            {errors.deliveryInfo.fullName.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <div className="w-full">
          <label
            htmlFor="address"
            className="block mt-4 font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            {...register("deliveryInfo.address", {
              required: "Address is required",
            })}
            placeholder="Enter your address"
            className="block w-full px-4 py-2 mt-1 duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
          />
          {errors.deliveryInfo?.address && (
            <p className="text-xs text-red-500 mt-0.5 font-light">
              {errors.deliveryInfo.address.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <label
            htmlFor="city"
            className="block mt-4 font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            {...register("deliveryInfo.city", {
              required: "City is required",
            })}
            placeholder="Enter your city"
            className="block w-full px-4 py-2 mt-1 duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
          />
          {errors.deliveryInfo?.city && (
            <p className="text-xs text-red-500 mt-0.5 font-light">
              {errors.deliveryInfo.city.message}
            </p>
          )}
        </div>
      </div>

      {/* Contact Phone */}
      <div className="">
        <label
          htmlFor="contactPhone"
          className="block mt-4 font-medium text-gray-700"
        >
          Contact Phone
        </label>
        <input
          type="tel"
          id="contactPhone"
          {...register("deliveryInfo.contactPhone", {
            required: "Contact Phone is required",
            pattern: {
              value:
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
              message: "Please enter a valid phone number",
            },
          })}
          placeholder="Enter your phone number"
          className="block w-full px-4 py-2 mt-1 duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
        />
        {errors.deliveryInfo?.contactPhone && (
          <p className="text-xs text-red-500 mt-0.5 font-light">
            {errors.deliveryInfo.contactPhone.message}
          </p>
        )}
      </div>

      <div className="">
        <label
          htmlFor="deliveryInstructions"
          className="block mt-4 font-medium text-gray-700"
        >
          Delivery Instructions (optional)
        </label>
        <textarea
          id="deliveryInstructions"
          {...register("deliveryInfo.deliveryInstructions")}
          placeholder="Any delivery instructions?"
          className="block w-full px-4 py-2 mt-1 duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
          rows={3}
        />
      </div>

      <SaveDeliveryInfoCheckbox />
    </div>
  );
};

export default DeliveryInfoForm;
