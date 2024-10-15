import expressAsyncHandler from "express-async-handler";
import { supabaseAdmin } from "../config/supabase.js";

// @desc    Update user profile
// @route   POST /api/user/update-profile
// @access  Private
// @role    user
export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (!username && !email) {
    res.status(400);
    throw new Error("Nothing to update!");
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    req.id,
    {
      email,
      user_metadata: { username },
    }
  );

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  res.status(200).json(data);
});

// @desc    Change user password
// @route   POST /api/user/change-password
// @access  Private
// @role    admin
export const changePassword = expressAsyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    res.status(400);
    throw new Error("Please provide both old and new password");
  }

  const { error } = await supabaseAdmin.auth.admin.updateUser(req.id, {
    password: newPassword,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  res.status(200).json({ message: "Password changed successfully" });
});

// @desc    Delete user account
// @route   DELETE /api/user/delete-account
// @access  Private
// @role    user
export const deleteAccount = expressAsyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(req.id);

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  res.status(200).json({ message: "Account deleted successfully" });
});
