import { MouseEventHandler, ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/confirm-dialog";

const ConfirmBeforeAction = ({
  title,
  description,
  children,
  onClick,
  disabled,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClick: MouseEventHandler;
  disabled?: boolean;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled} className="outline-none">
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent
        className="max-w-sm bg-white border-2 rounded-lg outline-none"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border border-gray-300 outline-none bg-gray-50 hover:bg-gray-300/50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="text-white bg-red-600 outline-none hover:bg-red-700"
            onClick={onClick}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmBeforeAction;
