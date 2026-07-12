import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Wraps every CUSTOMER-facing page with the shared Header + Footer.
 * <Outlet /> is React Router's placeholder for whichever child route
 * is currently active (Home, Shop, Cart, etc.) — this avoids repeating
 * <Header /> and <Footer /> in every single page file.
 */
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
