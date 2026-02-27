import { useState, useMemo } from "react";
import { Eye, Lock, Unlock, Trash2, Search } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import UserDetailModal from "../components/UserDetailModal";
import toast from "react-hot-toast";
import { useEffect } from "react";
import axiosAdmin from "../../api/axiosAdmin";

export default function Users() {
  const [data, setData] = useState([]);
  const [reset, setReset] = useState(false);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 2;
  const toggleActive = async (id) => {
    try {
      const res = await axiosAdmin.put(`/account/users/toggle/${id}`);
      setData((pre) => ({
        ...pre,
        users: pre.users.map((u) => (u._id === id ? { ...res.data.user } : u)),
      }));
    } catch (error) {}

    toast.success("Cập nhật trạng thái thành công!");
  };
  useEffect(() => {
    if (isTyping) {
      setPage(1);
    }
    const fetchData = async () => {
      try {
        const res = await axiosAdmin.get("/account/users", {
          params: {
            role: role ? role : "",
            status: status ? status : "",
            page,
            limit,
            keyword,
          },
        });
        setData(res.data);
        console.log(res.data);
      } catch (error) {}
    };

    fetchData();
  }, [role, status, page, keyword]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setRole(value);
  };
  const handleSelectChange2 = (e) => {
    const value = e.target.value;
    setStatus(value);
  };
  // Xóa user
  const deleteUser = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này không?")) return;

    try {
      await axiosAdmin.delete(`/account/users/${id}`);
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u._id !== id),
        total: prev.total - 1,
      }));
      toast.success("Đã xóa người dùng!");
    } catch (error) {}
    toast.success("Lỗi xóa người dùng!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        👥 Quản lý người dùng
      </h2>

      {/* Bộ lọc + tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
              handleSelectChange(e);
            }}
            className="border rounded-md px-3 py-2 bg-white text-gray-700"
          >
            <option>Tất cả vai trò</option>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
              handleSelectChange2(e);
            }}
            className="border rounded-md px-3 py-2 bg-white text-gray-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="blocked">Bị khóa</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm tên hoặc email..."
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:border-[#f93] w-72 outline-none placeholder:text-[1.2rem] text-[1.2rem]"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setIsTyping(true);
            }}
            onBlur={() => setIsTyping(false)}
          />
        </div>
      </div>

      {/* Bảng người dùng */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Vai trò</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Ngày tạo</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data?.users &&
              data.users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {u.fullName}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{u.email}</td>
                  <td className="px-4 py-2">
                    {u.role === "admin" ? "Quản trị viên" : "Người dùng"}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge
                      user
                      status={u.status === "active" ? "approved" : "rejected"}
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => toggleActive(u._id)}
                      className={`p-2 rounded-md ${
                        u.status === "blocked"
                          ? "text-yellow-600 hover:bg-yellow-100"
                          : "text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {u.status === "active" ? (
                        <Lock size={18} />
                      ) : (
                        <Unlock size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

            {data?.users?.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Trước
          </button>
          {Array.from({ length: data?.totalPages }, (_, i) => i + 1).map(
            (num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  page === num
                    ? "bg-orange-500 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, data?.totalPages))}
            disabled={page === data?.totalPages}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal chi tiết */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
