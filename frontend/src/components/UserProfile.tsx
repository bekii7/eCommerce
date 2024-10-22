import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import { useSupabase } from "../hooks/useSupabase";
import useCartContext from "../hooks/useCartContext";
import { toastUpdateConfig } from "../config";
import Profile from "./Profile";

const UserProfile = ({ iconSize }: { iconSize?: number }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { session, supabase } = useSupabase();
  const user = session?.user;
  const { resetOnSignOut } = useCartContext();

  const logout = async () => {
    const toastId = toast.loading(
      <div className="text-white">Logging out...</div>
    );
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.update(toastId, {
        render: "Error during logout. Please try again.",
        type: "error",
        ...toastUpdateConfig,
      });
    } else {
      navigate("/");
      resetOnSignOut();
      toast.update(toastId, {
        render: "Successfully logged out!",
        type: "success",
        ...toastUpdateConfig,
      });
    }
  };

  // Function to extract initials from email
  const getInitials = (email: string) => {
    const nameParts = email.split("@")[0].split(".");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials.substring(0, 2); // Limiting initials to 2 characters
  };

  return session ? (
    <div className="flex items-center justify-center">
      <Dialog>
        {/* Avatar/Profile Icon Trigger */}
        <DialogTrigger asChild>
          <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] text-lg text-white duration-300 bg-blue-500 rounded-full cursor-pointer lg:font-bold hover:bg-blue-600">
            {getInitials(user?.email ?? "")}
          </div>
        </DialogTrigger>

        {/* Dialog Modal */}
        <DialogContent
          className="px-0 py-6 bg-white rounded-lg shadow-lg outline-none sm:p-6 max-h-[75vh] sm:max-h-[85vh] h-full overflow-y-auto"
          aria-describedby=""
        >
          <DialogHeader>
            <DialogTitle className="pt-1 text-2xl font-black">Profile</DialogTitle>
          </DialogHeader>
          <div className="relative overflow-y-auto max-h-[75vh] px-0 w-full">
            {/* Profile component */}
            <Profile />
          </div>
          <DialogFooter className="w-full px-4 bg-white sm:justify-center">
            <DialogClose asChild>
              <button
                className="flex items-center justify-center w-full gap-2 p-2 text-white bg-red-600 rounded-md outline-none hover:bg-red-700"
                onClick={logout}
              >
                <MdLogout size={24} />
                <span className="font-bold">Log Out</span>
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <Link to="/sign-in" state={{ from: location.pathname }}>
      <MdAccountCircle size={iconSize || 32} />
    </Link>
  );
};

export default UserProfile;
