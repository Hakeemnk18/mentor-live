import UserNavbar from "../../features/user/components/Navbar";
import Footer from "../../features/user/components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;