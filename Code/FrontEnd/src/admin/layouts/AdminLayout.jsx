import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1">
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
