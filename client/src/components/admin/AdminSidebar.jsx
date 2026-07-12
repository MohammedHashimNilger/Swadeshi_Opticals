import { NavLink, useNavigate } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconBox,
  IconCategory,
  IconShoppingBag,
  IconUsers,
  IconPrescription,
  IconPhoto,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { to: "/admin/products", label: "Products", icon: IconBox },
  { to: "/admin/categories", label: "Categories", icon: IconCategory },
  { to: "/admin/orders", label: "Orders", icon: IconShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: IconUsers },
  { to: "/admin/prescriptions", label: "Prescriptions", icon: IconPrescription },
  { to: "/admin/banners", label: "Banners", icon: IconPhoto },
  { to: "/admin/settings", label: "Settings", icon: IconSettings },
];

export default function AdminSidebar() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <aside className="flex w-48 flex-shrink-0 flex-col gap-1 border-r border-navy-100 bg-white p-3 dark:border-navy-700 dark:bg-navy-900">
      <p className="mb-2 px-2 text-sm font-medium text-navy-800 dark:text-navy-50">Admin</p>
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
              isActive
                ? "bg-navy-100 text-navy-900 dark:bg-navy-700 dark:text-white"
                : "text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800"
            }`
          }
        >
          <Icon size={16} /> {label}
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800"
      >
        <IconLogout size={16} /> Log out
      </button>
    </aside>
  );
}
