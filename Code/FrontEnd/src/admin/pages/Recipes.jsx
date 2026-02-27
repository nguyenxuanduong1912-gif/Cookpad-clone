import { useState, useMemo } from "react";
import { Eye, Check, X, Search, Filter } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import RecipeDetailModal from "../components/RecipeDetailModal";
import toast from "react-hot-toast";
import axiosAdmin from "../../api/axiosAdmin";
import { useEffect } from "react";
import VerifyResultModal from "./VerifyResultModal";
export default function Recipes() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const limit = 100;
  const [reportFilter, setReportFilter] = useState("all"); // all | reported | clean
  const [keyword, setKeyword] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifyData, setVerifyData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosAdmin.get(`/recipe/getAllRecipes`, {
          params: { page, limit, status, reported: reportFilter, keyword },
        });
        setData(res.data);
        console.log(res.data);
      } catch (error) {
        toast("Lỗi");
      }
    };

    fetchData();
  }, [page, status, reportFilter, keyword, reloadTrigger]);

  const handleVerify = async (recipeId) => {
    setLoading(true);
    try {
      const res = await axiosAdmin.put(`/recipe/${recipeId}/verify`);
      setVerifyData(res.data);
      setModalOpen(true);
      setLoading(false);
    } catch (err) {
      alert("Lỗi kiểm chứng: " + (err.response?.data?.message || err.message));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosAdmin.put(`/recipe/${id}/${status}`);
      toast.success(
        `Đã ${status === "approved" ? "duyệt" : "từ chối"} công thức!`
      );
      setData((prev) => ({
        ...prev,
        recipes: prev.recipes.map((r) => (r._id === id ? { ...r, status } : r)),
      }));
    } catch (error) {
      toast.error("Có lỗi");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data?.totalPages) setPage(newPage);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📖 Quản lý công thức
      </h2>

      {/* Bộ lọc & tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
                setStatus(status);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                statusFilter === status
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status === "all"
                ? "Tất cả"
                : status === "pending"
                ? "Chờ duyệt"
                : status === "approved"
                ? "Đã duyệt"
                : "Từ chối"}
            </button>
          ))}

          {/* Lọc báo cáo */}
          <select
            value={reportFilter}
            onChange={(e) => {
              setReportFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả món</option>
            <option value="true">Đã báo cáo</option>
            <option value="false">Chưa báo cáo</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm món ăn hoặc tên..."
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:border-[#f93] w-64 ml-[4px] outline-none placeholder:text-[1rem] text-[1.2rem]"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Bảng công thức */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Ảnh</th>
              <th className="px-4 py-2 text-left">Tên món</th>
              <th className="px-4 py-2 text-left">Người đăng</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-center">Báo cáo</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data?.recipes?.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                </td>
                <td className="px-4 py-2 font-medium">{r.name}</td>
                <td className="px-4 py-2">{r.createdBy.fullName}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-2 text-center">
                  {r.reports && r.reports.length > 0 ? (
                    <span className="text-red-600 font-semibold">
                      {r.reports.length} lần
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => setSelectedRecipe(r)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => updateStatus(r._id, "approved")}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => updateStatus(r._id, "rejected")}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {data?.total === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không tìm thấy món ăn phù hợp.
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
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Trước
          </button>
          {Array.from({ length: data?.totalPages }, (_, i) => i + 1).map(
            (num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
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
            onClick={() => handlePageChange(page + 1)}
            disabled={page === data?.totalPages}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Sau
          </button>
        </div>
      )}
      <VerifyResultModal
        key={`verify-${selectedRecipe?._id}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={verifyData}
        data2={selectedRecipe}
        recipeId={selectedRecipe?._id}
        onResetData={(updatedRecipe) => setSelectedRecipe(updatedRecipe)}
        setReloadTrigger={setReloadTrigger}
      />
      {/* Modal chi tiết */}
      {selectedRecipe && (
        <RecipeDetailModal
          key={selectedRecipe?._id}
          recipe={selectedRecipe}
          setOpenModal={() => setModalOpen(true)}
          onClose={() => setSelectedRecipe(null)}
          onApprove={(id) => updateStatus(id, "approved")}
          onReject={(id) => updateStatus(id, "rejected")}
          onRecipeUpdate={(updatedRecipe) => setSelectedRecipe(updatedRecipe)}
          setReloadTrigger={setReloadTrigger}
          handleVerify={handleVerify}
          loading={loading}
        />
      )}
    </div>
  );
}
