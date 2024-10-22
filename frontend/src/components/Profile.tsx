import { useState, useEffect } from "react";
import { useSupabase } from "../hooks/useSupabase";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import useUserData from "../hooks/useUserData";
import { MdEdit } from "react-icons/md";

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { AccordionContent } from "./ui/accordion";
import ConfirmBeforeAction from "./ConfirmBeforeAction"; // Import the confirmation component
import { FiAlertTriangle } from "react-icons/fi";
import { deleteUser, updateUser } from "../api";
import { toastUpdateConfig } from "../config";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ email: "", username: "" });
  const [accordionValue, setAccordionValue] = useState(""); // For toggling edit mode accordion
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { supabase } = useSupabase();
  const { user, error } = useUserData();

  // Fetch the user's profile details
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      if (error) {
        toast.error("Failed to fetch profile");
        setLoading(false);
        return;
      }
      setProfile({
        email: user?.email || "",
        username: user?.user_metadata.username || "",
      });
      setLoading(false);
    };

    fetchProfileData();
  }, [user]);

  // Handle profile updates (like email or username)
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const response = await updateUser(profile.email, profile.username);

      if (!response.ok) {
        toast.error("Failed to update profile");
      } else {
        const data = await response.json();
        toast.success("Profile updated successfully!");
        setProfile({
          email: data.user.email || "",
          username: data.user.user_metadata.username,
        });
        setAccordionValue("");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsSaving(false);
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    setIsSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      toast.error("Failed to change password");
    } else {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    }
    setIsSaving(false);
  };

  // Delete account functionality
  const handleDeleteAccount = async () => {
    const deleteToast = toast.loading("Deleting account...");
    const response = await deleteUser();
    if (!response.ok) {
      toast.update(deleteToast, {
        render: "Failed to delete account",
        type: "error",
        ...toastUpdateConfig,
      });
    } else {
      toast.update(deleteToast, {
        render: "Your account has been deleted!",
        type: "success",
        ...toastUpdateConfig,
      });

      await supabase.auth.signOut();
    }
  };

  const getInitials = (email: string) => {
    const nameParts = email.split("@")[0].split(".");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials.substring(0, 2); // Limiting initials to 2 characters
  };

  // Render initials from the username
  const renderInitials = () => {
    return getInitials(profile.email);
  };

  // Render the profile view
  if (loading) return <ClipLoader size={50} color="orange" />;

  return (
    <div className="container max-w-xl p-4 mx-auto">
      {/* <h2 className="text-xl font-semibold">Edit Profile</h2> */}

      <div className="flex flex-col divide-y divide-gray-400/65 rounded-xl">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="pb-6"
        >
          <AccordionItem value="edit" className="group">
            <AccordionHeader>
              <AccordionTrigger className="flex items-center justify-between w-full outline-none">
                <div className="relative flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl text-white bg-orange-400 rounded-full">
                    {renderInitials()}
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <h3 className="text-lg font-medium">{profile.email}</h3>
                    <p className="text-sm text-gray-500">{profile.username}</p>
                  </div>
                </div>
                <div className="sm:opacity-0 p-2 mx-4 text-sm font-medium text-white transition-all bg-orange-500 rounded-md group-hover:opacity-100 group-data-[state=open]:opacity-100 hover:bg-orange-600">
                  <MdEdit />
                </div>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="px-6 sm:px-4">
              <div className="mt-6">
                <h3 className="mb-4 text-xl">Edit Profile</h3>
                <div className="mb-4 space-y-1">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="profile_email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full p-2 duration-300 border rounded-md outline-none focus:border-orange-500"
                  />
                </div>
                <div className="mb-4 space-y-1">
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="profile_username"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    className="w-full p-2 duration-300 border rounded-md outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateProfile}
                    className={`px-4 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all ${
                      isSaving && "opacity-50"
                    }`}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    onClick={() => setAccordionValue("")}
                    className="px-4 py-1.5 text-orange-700 transition-all border border-gray-400 rounded-md bg-gray-100 hover:bg-gray-400/50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Change Password Section */}
        <div className="px-2 py-6 text-sm">
          <h3 className="mb-4 text-xl font-semibold">Change Password</h3>
          <div className="mb-4 space-y-1">
            <label className="block text-sm font-medium">
              Current Password
            </label>
            <input
              name="profile_cpassword"
              autoCapitalize="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 duration-300 border rounded-md outline-none focus:border-orange-500"
            />
          </div>
          <div className="mb-4 space-y-1">
            <label className="block text-sm font-medium">New Password</label>
            <input
              name="profile_npassword"
              autoComplete="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 duration-300 border rounded-md outline-none focus:border-orange-500"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className={`px-4 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all ${
              isSaving && "opacity-50"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Changing Password..." : "Change Password"}
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="py-6">
          <div className="p-4 border border-red-600 rounded-lg bg-red-50">
            <div className="flex items-center mb-2">
              <FiAlertTriangle
                className="mr-3 text-2xl text-red-600"
                size={72}
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-red-700">
                  Account Deletion
                </h3>
                <p className="text-sm font-medium text-red-600">
                  Deleting your account is permanent and cannot be undone. Your
                  data will be deleted along with all information associated
                  with your account.
                </p>
                <ConfirmBeforeAction
                  title="Are you sure you want to delete your account?"
                  description="This action is irreversible. All your data, including any pending or incomplete orders, will be permanently deleted. If your order has not been shipped, it will be automatically canceled."
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                >
                  <div className="px-4 py-1.5 mt-2 text-sm text-white transition-colors bg-red-700 rounded-md hover:bg-red-600/80 outline-none">
                    Delete my account
                  </div>
                </ConfirmBeforeAction>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
