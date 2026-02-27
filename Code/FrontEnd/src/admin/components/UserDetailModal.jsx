import { X } from "lucide-react";

export default function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết người dùng
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3 text-gray-700">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "/avatar-default.png"}
              alt={user.fullName}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-lg">{user.fullName}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="text-sm mt-1">
                Vai trò:{" "}
                <span className="font-medium text-gray-800">
                  {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t pt-3 text-sm space-y-2">
            <p>
              <strong>Trạng thái:</strong>{" "}
              {user.status ? "Hoạt động" : "Bị khóa"}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </p>
            {user.phone && (
              <p>
                <strong>Số điện thoại:</strong> {user.phone}
              </p>
            )}
            {user.address && (
              <p>
                <strong>Địa chỉ:</strong> {user.address}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
