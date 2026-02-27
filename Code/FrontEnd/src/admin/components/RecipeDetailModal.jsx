import { X, Check, XCircle, ShieldCheck } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { Image } from "primereact/image";
import toast from "react-hot-toast";
import axiosAdmin from "../../api/axiosAdmin";

export default function RecipeDetailModal({
  recipe,
  onClose,
  onApprove,
  onReject,
  onRecipeUpdate,
  setReloadTrigger,
  handleVerify,
  setOpenModal,
  loading,
}) {
  if (!recipe) return null;

  const handleResolve = async (id, recipeId, action) => {
    if (action === "delete") {
      if (!confirm("Bạn có chắc muốn xóa báo cáo này không?")) {
        return;
      }
    }
    try {
      const res = await axiosAdmin.put(`/recipe/handleReport`, {
        recipeId,
        reportId: id,
        action,
      });
      const updated = await axiosAdmin.get(`/recipe/detail/${recipeId}`);
      onRecipeUpdate && onRecipeUpdate(updated.data);
      setReloadTrigger((pre) => pre + 1);
      toast.success(`Đã xử lý!`);
    } catch (error) {
      toast.error("Lỗi");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>

        {/* 🧾 Thông tin tổng quan */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full md:w-1/2 h-60 object-cover rounded-xl"
          />

          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              {recipe.name}
            </h2>
            <StatusBadge status={recipe.status} />
            {recipe.verified ? (
              <span
                onClick={setOpenModal}
                className={`cursor-pointer ml-[5px] px-3 py-1.5 border rounded-full text-xs font-semibold transition-all duration-300 ${"bg-green-100 text-green-600 border-red-yellow"}`}
              >
                {"Đã được kiểm chứng"}
              </span>
            ) : (
              <span
                className={`ml-[5px] px-3 py-1.5 border rounded-full text-xs font-semibold transition-all duration-300 ${"bg-yellow-100 text-yellow-600 border-red-yellow"}`}
              >
                {"Chưa được kiểm chứng"}
              </span>
            )}
            <p className="text-gray-500 text-sm">
              Người đăng:{" "}
              <span className="text-gray-800 font-medium">
                {recipe.createdBy?.fullName || "Ẩn danh"}
              </span>
            </p>
            <p className="text-gray-500 text-sm">
              Ngày đăng:{" "}
              {new Date(recipe.createdAt).toLocaleDateString("vi-VN")}
            </p>

            <div className="mt-3">
              <p className="text-gray-600 text-sm leading-relaxed">
                {recipe.description ||
                  "Món ăn này chưa có mô tả chi tiết, nhưng hình ảnh và tên món đã rất hấp dẫn rồi!"}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <p className="text-gray-600 text-sm">
                👨‍🍳 Khẩu phần:{" "}
                <span className="font-medium text-gray-800">
                  {recipe.servings} người
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                ⏱️ Thời gian:{" "}
                <span className="font-medium text-gray-800">
                  {recipe.cookTime} phút
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 🧂 Nguyên liệu */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🧂 Nguyên liệu
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {recipe.ingredients?.length > 0 ? (
              recipe.ingredients.map((i, index) => (
                <li key={index}>
                  {i.name} - {i.quantity} {i.unit}
                </li>
              ))
            ) : (
              <li>Không có nguyên liệu nào được liệt kê.</li>
            )}
          </ul>
        </div>

        {/* 👩‍🍳 Các bước */}
        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            👩‍🍳 Các bước thực hiện
          </h3>
          <div className="space-y-4">
            {recipe.steps?.length > 0 ? (
              recipe.steps.map((step, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden w-full"
                >
                  <div className="flex gap-[2px] w-full justify-center">
                    {step.images.map((image, index) => (
                      <img
                        src={image}
                        alt={`Bước ${index + 1}`}
                        height={200}
                        className="h-[170px] object-cover flex-1"
                      />
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50">
                    <p className="text-sm text-gray-700 font-medium">
                      <span className="text-orange-500">Bước {index + 1}:</span>{" "}
                      {step.instruction}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Chưa có bước hướng dẫn nào được thêm.
              </p>
            )}
          </div>
        </div>

        {/* 🚨 Báo cáo */}
        {recipe.reports && recipe.reports.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🚨 Báo cáo vi phạm
            </h3>
            {/* {recipe.reports.every((r) => r.handled === true) && (
              <p className="text-center text-[1.2rem]">Đã xử lý hết báo cáo</p>
            )} */}
            <div className="space-y-3">
              {recipe.reports.map((report, index) => (
                <div
                  key={index}
                  className="border border-red-200 bg-red-50 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      Người báo cáo:{" "}
                      <span className="text-red-600">
                        {report.userId?.fullName || "Người dùng ẩn danh"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      📝 Lý do:{" "}
                      <span className="font-medium text-gray-800">
                        {report.reason}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ngày gửi:{" "}
                      {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  {/* 🔘 Nút xử lý + xóa */}

                  {report.handled ? (
                    <button className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm">
                      ✅Đã xử lý
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleResolve(report._id, recipe._id, "resolve")
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
                      >
                        ✅ Xử lý
                      </button>
                      <button
                        onClick={() =>
                          handleResolve(report._id, recipe._id, "delete")
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => {
              onReject(recipe._id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          >
            <XCircle size={18} /> Từ chối
          </button>

          {!recipe.verified && (
            <button
              onClick={() => handleVerify(recipe._id)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-500 rounded-md hover:bg-yellow-200 transition"
            >
              {loading ? (
                <div className="w-[25px] h-[25px] border-[4px] rounded-[50%] border-t-red-500 animate-rotate"></div>
              ) : (
                <>
                  <ShieldCheck size={18} /> Kiểm chứng
                </>
              )}
            </button>
          )}

          {recipe.status !== "approved" && (
            <button
              onClick={() => {
                onApprove(recipe._id);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
            >
              <Check size={18} /> Duyệt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
