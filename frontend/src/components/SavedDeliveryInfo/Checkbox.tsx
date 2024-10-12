import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CustomOrder, Order } from "../../types";
import { MdCheck } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useDeliveryInfoContext } from "../../contexts/DeliveryInfoContext";
import { useSupabase } from "../../hooks/useSupabase";

const SaveDeliveryInfoCheckbox = () => {
  const { authenticated } = useSupabase();
  const { savedDeliveryInfos, isLoading, error } = useDeliveryInfoContext();

  const { register, setValue, control, watch } = useFormContext<
    CustomOrder | Order
  >();
  const watchedFields = useWatch({
    control,
    name: [
      "deliveryInfo.fullName",
      "deliveryInfo.address",
      "deliveryInfo.city",
      "deliveryInfo.contactPhone",
    ],
  });
  const deliveryInfo = watch("deliveryInfo");

  // Check if delivery info is already saved
  const isAlreadySaved = savedDeliveryInfos?.some(
    (info) =>
      info?.fullName?.trim() === deliveryInfo?.fullName?.trim() &&
      info?.address?.trim() === deliveryInfo?.address?.trim() &&
      info?.city?.trim() === deliveryInfo?.city?.trim() &&
      info?.contactPhone?.trim() === deliveryInfo?.contactPhone?.trim()
  );

  // If already saved, ensure checkbox is disabled and unchecked
  useEffect(() => {
    if (isAlreadySaved) {
      setValue("deliveryInfo.saveInfo", false); // Uncheck the checkbox
    } else {
      setValue("deliveryInfo.saveInfo", true); // Check the checkbox
    }
  }, [watchedFields]);

  if (!authenticated || error) return null;
  if (isLoading)
    return (
      <span className="flex justify-center mt-4">
        <ClipLoader size={24} color="#f97316" />
      </span>
    );

  return (
    <div className="flex items-center mt-4">
      <input
        type="checkbox"
        id="saveInfo"
        defaultChecked={false}
        {...register("deliveryInfo.saveInfo")}
        className="relative w-4 h-4 transition-all border border-gray-300 rounded outline-none appearance-none cursor-pointer peer focus:ring-orange-400 checked:bg-orange-500 checked:border-transparent"
        disabled={isAlreadySaved} // Disable checkbox if info is already saved
      />
      <label
        htmlFor="saveInfo"
        className={`ml-2 text-sm font-normal cursor-pointer ${
          isAlreadySaved ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {isAlreadySaved
          ? "This delivery info is already saved"
          : "Save this delivery info for future use"}
      </label>
      <MdCheck
        className="absolute hidden w-4 h-4 text-white cursor-pointer peer-checked:block"
        onClick={() => setValue("deliveryInfo.saveInfo", true)}
      />
    </div>
  );
};

export default SaveDeliveryInfoCheckbox;
