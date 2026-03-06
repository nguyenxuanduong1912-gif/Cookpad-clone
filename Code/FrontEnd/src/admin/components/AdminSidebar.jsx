import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  BookOpen,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import classNames from "classnames";

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();
  const menu = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <BarChart2 size={18} />,
    },
    {
      label: "Công thức",
      path: "/admin/recipes",
      icon: <BookOpen size={18} />,
    },
    { label: "Người dùng", path: "/admin/users", icon: <Users size={18} /> },
    { label: "Danh mục", path: "/admin/categories", icon: <Users size={18} /> },
  ];

  return (
    <aside
      className={classNames(
        "relative bg-white shadow-lg transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="text-2xl font-bold text-orange-500 truncate">
          {!collapsed && "Cookpad"}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-orange-50 text-orange-600"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={classNames(
              "flex items-center gap-3 px-5 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all",
              pathname === item.path &&
                "bg-orange-100 text-orange-600 font-medium",
              collapsed && "justify-center px-3"
            )}
          >
            {item.icon}
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
