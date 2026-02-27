import { Bell, LogOut, Menu } from "lucide-react";

export default function AdminHeader({ collapsed, setCollapsed }) {
  const user = {
    name: "Nguyễn Xuân Dương",
    avatar: "https://i.pravatar.cc/100?img=3",
  };

  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Bảng điều khiển</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md cursor-pointer transition">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <span className="text-gray-700 font-medium">{user.name}</span>
        </div>

        <button className="p-2 rounded-full hover:bg-orange-100 text-orange-600">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
