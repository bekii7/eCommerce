import { MdErrorOutline } from "react-icons/md";
import { cn } from "../lib/utils";

interface ErrorProps {
  title: string;
  description: string;
  className?: string;
  retry?: () => {};
}

const ErrorMessage = ({ title, description, className, retry }: ErrorProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full mx-auto mt-4 text-red-500 border border-red-400 rounded-lg bg-red-50",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 p-6 max-w-[48rem]">
        <MdErrorOutline className="mb-2 text-4xl" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="px-8 mb-4 text-center">{description}</p>
        {retry && (
          <button
            onClick={() => retry()}
            className="px-4 py-2 text-white duration-300 bg-red-500 rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
