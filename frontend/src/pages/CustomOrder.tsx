import React, { useRef, useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { cn } from "../lib/utils";
import DeliveryInfoForm from "../components/DeliveryInfoForm";
import { CustomOrder } from "../types";
import { useSupabase } from "../hooks/useSupabase";
import { toast } from "react-toastify";
import { placeCustomOrder, saveDeliveryInfo } from "../api";
import { useDeliveryInfoContext } from "../contexts/DeliveryInfoContext";
import { useNavigate } from "react-router-dom";

const CustomOrderPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // Loading state for image upload
  const [uploadError, setUploadError] = useState<string | null>(null); // Error state for image upload
  const [imageId, setImageId] = useState<string | null>(null); // Store the image URL from Supabase
  const imageFileName = useRef<string | null>();

  const { supabase, session } = useSupabase();

  const navigate = useNavigate();

  const methods = useForm<CustomOrder>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const getImagePath = () => `${session?.user.id}/${imageFileName.current}`;

  // Function to upload image to Supabase
  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      // Generate a unique file name for the upload
      const fileExt = file.name.split(".").pop();
      imageFileName.current = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("c_order_image")
        .upload(getImagePath(), file);

      if (error) {
        throw new Error(error.message);
      }

      const id = data.id;

      if (!id) {
        throw new Error("Failed to get image URL");
      }

      setImageId(id);
      setValue("image", id); // Associate image id with the form
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show a temporary preview
      uploadImage(file); // Upload to Supabase
    }
  };

  // Remove image and delete it from Supabase if it was uploaded
  const removeImage = async () => {
    if (uploading) {
      toast.error("Upload in progress, please wait.");
      return;
    }

    setUploadError(null);
    setImagePreview(null);
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    if (imageId) {
      await supabase.storage.from("c_order_image").remove([getImagePath()]); // Remove image from Supabase storage
      setImageId(null);
      setValue("image", null);
      imageFileName.current = null;
    }
  };

  const { triggerRefresh } = useDeliveryInfoContext();

  const onSubmit: SubmitHandler<CustomOrder> = async (data) => {
    if (uploading) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    try {
      const response = await placeCustomOrder({
        body: {
          orderInfo: data,
        },
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

      toast.success(
        "Order submitted successfully! Keep an eye on your email for an update."
      );

      removeImage();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen my-6">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-orange-600">
          Custom Product Order
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
            {/* Product Name */}
            <div className="">
              <label
                htmlFor="productName"
                className="block font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                {...register("productName", {
                  required: "Product Name is required",
                })}
                placeholder="Enter the product name"
                className="block w-full px-4 py-2 mt-1 transition-all duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
              />
              {errors.productName && (
                <p className="text-xs text-red-500 mt-0.5 font-light">
                  {errors.productName.message}
                </p>
              )}
            </div>

            {/* Product Description */}
            <div className="">
              <label
                htmlFor="description"
                className="block font-medium text-gray-700"
              >
                Product Description (optional)
              </label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Provide details about the product"
                className="block w-full px-4 py-2 mt-1 transition-all duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
                rows={4}
              />
            </div>

            {/* External Link */}
            <div className="">
              <label
                htmlFor="externalLink"
                className="block font-medium text-gray-700"
              >
                External Link
              </label>
              <input
                type="url"
                id="externalLink"
                {...register("externalLink", {
                  required: "External Link is required",
                })}
                placeholder="Enter external link (e.g., Amazon)"
                className="block w-full px-4 py-2 mt-1 transition-all duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
              />
              {errors.externalLink && (
                <p className="text-xs text-red-500 mt-0.5 font-light">
                  {errors.externalLink.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="">
              <label
                htmlFor="image"
                className="block font-medium text-gray-700"
              >
                Upload Image (optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full mt-1 text-sm text-gray-500 transition-all duration-300 outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 file:outline-none file:cursor-pointer"
              />
              {imagePreview && (
                <div className="relative inline-block mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-20 h-20 rounded-lg shadow-md"
                  />
                  {/* X Icon (Close Button) */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute flex items-center justify-center w-6 h-6 p-2 transition-all bg-red-600 rounded-full -right-2.5 -top-2.5 hover:bg-red-500"
                  >
                    <span className="text-lg font-semibold text-white">
                      &times;
                    </span>
                  </button>
                </div>
              )}
              {uploading && (
                <p className="text-sm font-light text-orange-600">
                  Uploading image...
                </p>
              )}
              {uploadError && (
                <p className="text-sm font-light text-red-600">
                  Failed. Please try again...
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="">
              <label
                htmlFor="additionalNotes"
                className="block font-medium text-gray-700"
              >
                Additional Notes (optional)
              </label>
              <textarea
                id="additionalNotes"
                {...register("additionalNotes")}
                placeholder="Any additional instructions?"
                className="block w-full px-4 py-2 mt-1 transition-all duration-300 border border-gray-300 rounded-md shadow-sm outline-none focus:border-orange-500"
                rows={3}
              />
            </div>

            {/* Delivery Information */}
            <h1 className="text-lg font-semibold outline-none">
              Delivery Information
            </h1>
            <DeliveryInfoForm />

            {/* Submit Button */}
            <button
              type="submit"
              className={cn(
                "relative flex items-center justify-center w-full gap-2 px-4 py-2 font-semibold text-white transition-all duration-300 bg-orange-500 disabled:bg-orange-400 rounded-md shadow",
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
              {isSubmitting ? "Submitting" : "Submit Order"}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CustomOrderPage;
