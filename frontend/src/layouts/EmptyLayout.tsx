import { Outlet } from "react-router-dom";

const EmptyLayout = () => {
  return (
    <main className="bg-bg">
      <Outlet />
    </main>
  );
};

export default EmptyLayout;
