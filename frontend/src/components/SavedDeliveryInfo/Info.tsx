import { useFormContext, useWatch } from "react-hook-form";
import { CustomOrder, DeliveryInfo, Order } from "../../types";
import { ClipLoader } from "react-spinners";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown";
import { useEffect, useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { useDeliveryInfoContext } from "../../contexts/DeliveryInfoContext";

const SavedDeliveryInfo = () => {
  const { savedDeliveryInfos, isLoading, error } = useDeliveryInfoContext();
  const { setValue, watch, resetField, control } = useFormContext<
    CustomOrder | Order
  >();
  const [selectedInfoId, setSelectedInfoId] = useState<string | null>(null);
  const deliveryInfo = watch("deliveryInfo");

  const isFormFillingProgrammatic = useRef(false);

  const watchedFields = useWatch({
    control,
    name: [
      "deliveryInfo.address",
      "deliveryInfo.city",
      "deliveryInfo.fullName",
      "deliveryInfo.contactPhone",
    ],
  });

  useEffect(() => {
    if (!savedDeliveryInfos || !deliveryInfo) return;

    if (isFormFillingProgrammatic.current) {
      isFormFillingProgrammatic.current = false;
      return;
    }

    // Find matching info by comparing deliveryInfo with savedDeliveryInfos
    const infoId = savedDeliveryInfos.find(
      (info) =>
        info.fullName === deliveryInfo.fullName &&
        info.address === deliveryInfo.address &&
        info.city === deliveryInfo.city &&
        info.contactPhone === deliveryInfo.contactPhone
    )?.id;

    // If no match found, set the first savedDeliveryInfo as default
    if (
      !infoId &&
      savedDeliveryInfos.length > 0 &&
      isFormFillingProgrammatic.current
    ) {
      setSelectedInfoId(savedDeliveryInfos[0].id); // Set the first option's id as default
      setValue("deliveryInfo", savedDeliveryInfos[0]);
    } else {
      setSelectedInfoId(infoId ?? null); // Set the matched infoId if found, or null
    }

    // Reset the flag after filling
    isFormFillingProgrammatic.current = false;
  }, [watchedFields]);

  // Automatically select the first item when data is loaded
  useEffect(() => {
    if (savedDeliveryInfos.length > 0) {
      isFormFillingProgrammatic.current = true; // Programmatically filling the form
      setSelectedInfoId(savedDeliveryInfos[0].id);
      setValue("deliveryInfo", savedDeliveryInfos[0]);
    }
  }, [savedDeliveryInfos]);

  // Handle dropdown selection
  const handleSelect = (info: DeliveryInfo) => {
    isFormFillingProgrammatic.current = true; // Programmatically filling the form
    setSelectedInfoId(info.id);
    setValue("deliveryInfo", info); // Update form fields
  };

  // Clear the delivery info form and selection
  const handleClear = () => {
    isFormFillingProgrammatic.current = true; // Programmatically filling the form

    (Object.keys(deliveryInfo) as (keyof DeliveryInfo)[]).forEach((key) => {
      resetField(`deliveryInfo.${key}`);
    });
    setSelectedInfoId(null);
  };

  const getTriggerTitle = () => {
    if (!selectedInfoId) return "Select from saved";
    const selectedInfo = savedDeliveryInfos.find(
      (info) => info.id === selectedInfoId
    );
    return `${selectedInfo?.fullName} - ${selectedInfo?.address}, ${selectedInfo?.city}`;
  };

  if (isLoading)
    return (
      <span className="flex justify-center">
        <ClipLoader size={24} color="#f97316" />
      </span>
    );
  if (error || savedDeliveryInfos.length == 0) return null;

  return (
    <div className="flex justify-between gap-2 pb-4 mb-4 border-b border-b-gray-300">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          asChild
          className="group duration-300 hover:bg-gray-200 rounded-md data-[state=open]:bg-gray-200 text-sm text-nowrap overflow-hidden"
        >
          <div className="relative flex items-center w-full">
            <button
              type="button"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-start"
            >
              {getTriggerTitle()}
            </button>
            <span className="absolute right-0 flex items-center h-full overflow-hidden duration-300 bg-white border-r border-gray-300 cursor-pointer border-y rounded-r-md group-hover:bg-gray-200 group-data-[state=open]:bg-gray-200">
              <MdArrowDropDown
                size={28}
                className="group-data-[state=open]:-rotate-180 transform duration-300 ease-in"
              />
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={selectedInfoId ?? ""}
            onValueChange={(id) => {
              const selectedInfo = savedDeliveryInfos.find(
                (info) => info.id === id
              );
              if (selectedInfo) handleSelect(selectedInfo);
            }}
          >
            {savedDeliveryInfos.map((info) => (
              <DropdownMenuRadioItem key={info.id} value={info.id}>
                {info.fullName} - {info.address}, {info.city}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Button to clear selection */}
      <button
        type="button"
        onClick={handleClear}
        className="px-4 py-2 text-sm duration-300 border border-gray-300 rounded-md outline-none hover:bg-gray-200"
      >
        Clear
      </button>
    </div>
  );
};

export default SavedDeliveryInfo;
