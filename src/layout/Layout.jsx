import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  // Verifica si la ruta actual es "/administracion"
  const isAdminRoute = location.pathname.startsWith("/prueba") || location.pathname.startsWith("/administracion");

  return (
    <div className="relative w-full min-h-screen">
      <Header />
      <Outlet />
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;