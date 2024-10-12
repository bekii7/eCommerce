import { useSearchParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const AuthErrorPage = () => {
  const [searchParams] = useSearchParams();

  // Extract error and error_description from the query params
  const errorTitle = searchParams.get("error") || "Authentication Error";
  const errorDescription =
    searchParams.get("error_description") ||
    "An unknown error occurred during authentication.";

  return (
    <div className="flex items-center justify-center bg-gray-100 h-navOffsetLg">
      <ErrorMessage
        title={errorTitle}
        description={errorDescription}
        className="max-w-md"
      />
    </div>
  );
};

export default AuthErrorPage;
