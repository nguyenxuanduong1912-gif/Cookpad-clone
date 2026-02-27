import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // ⚙️ Giả lập đăng nhập admin
    setTimeout(() => {
      if (email === "admin@cookpad.vn" && password === "123456") {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("adminToken", "fake-admin-token");
        navigate("/admin/dashboard");
      } else {
        toast.error("Email hoặc mật khẩu không đúng!");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-yellow-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Logo & Tiêu đề */}
        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/857/857681.png"
            alt="Admin"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Đăng nhập Quản trị
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng đăng nhập để truy cập trang quản lý.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email quản trị"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-gray-700 ml-[4px] text-[1.4rem]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-gray-700 ml-[4px] text-[1.4rem]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Ghi chú */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 Cookpad Admin Panel
        </p>
      </div>
    </div>
  );
}
