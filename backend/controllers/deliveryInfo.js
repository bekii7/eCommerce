import asynchandler from "express-async-handler";
import { sDatabase } from "../config/supabase.js";

// @desc    Get delivery info
// @route   GET /api/delivery-info/get-infos
// @access  Private
// @role    User
export const getInfos = asynchandler(async (req, res) => {
  const { data, error } = await sDatabase
    .from("delivery_info")
    .select()
    .eq("user_id", req.id);

  if (error) {
    res.status(500);
    throw error;
  }

  res.status(200).json({
    message: "Delivery info fetched successfully",
    data: data.map((item) => {
      return {
        id: item.id,
        fullName: item.full_name,
        address: item.address,
        city: item.city,
        contactPhone: item.contact_phone,
        deliveryInstructions: item.delivery_instructions,
      };
    }),
  });
});

// @desc    Save delivery info
// @route   POST /api/delivery-info/save-info
// @access  Private
// @role    User
export const saveInfo = asynchandler(async (req, res) => {
  const { deliveryInfo } = req.body;
  console.log(req.body);

  if (!deliveryInfo) {
    res.status(400);
    throw new Error("Cannot save delivery info without delivery information!");
  }

  const { fullName, address, city, contactPhone, deliveryInstructions } =
    deliveryInfo;

  if (!fullName || !address || !city || !contactPhone) {
    res.status(400);
    throw new Error("Delivery information is not complete!");
  }

  const { data, error } = await sDatabase
    .from("delivery_info")
    .insert({
      user_id: req.id,
      full_name: fullName,
      address,
      city,
      contact_phone: contactPhone,
      delivery_instructions: deliveryInstructions,
    })
    .select();

  if (error) {
    res.status(500);
    throw error;
  }
  console.log(data);

  res.status(200).json({ message: "Delivery info saved successfully", data });
});
