import { Bell, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function AdminHeader({ collapsed, setCollapsed }) {
  const user = {
    name: "Nguyễn Xuân Dương",
    avatar: "https://i.pravatar.cc/100?img=3",
  };
  const navigate = useNavigate();
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
        <button className="p-2 rounded-full hover:bg-orange-100 text-orange-600" onClick={() => {
          localStorage.removeItem('adminToken')
          navigate('/admin/login', { replace: true })
        }}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
