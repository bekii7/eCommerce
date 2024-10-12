import { Outlet, useNavigate } from "react-router-dom";

const SignLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen gap-8">
      <div className="flex gap-4 text-sm">
        <button
          className="text-orange-500 transition-all cursor-pointer hover:text-orange-300"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <button
          className="text-orange-500 transition-all cursor-pointer hover:text-orange-300"
          onClick={() => navigate("/")}
        >
          Go To Home
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default SignLayout;
