import { useState, useEffect } from "react";
import { Search, Trash2, Edit, Plus } from "lucide-react";
import toast from "react-hot-toast";
import axiosAdmin from "../../api/axiosAdmin";

export default function CategoryAdmin() {
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [preview, setPreview] = useState("");

  // 🔹 Lấy danh mục
  const fetchCategories = async () => {
    try {
      const res = await axiosAdmin.get("/category", {
        params: { keyword, limit, page },
      });
      setCategories(res.data.categories);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Không thể tải danh mục!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, keyword]);

  // 🔹 Tìm kiếm
  const handleSearch = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  // 🔹 Mở modal thêm/sửa
  const openModal = (cat = null) => {
    if (cat) {
      setEditing(cat);
      setForm({
        name: cat.name,
        description: cat.description,
        image: cat.image,
      });
      setPreview(cat.image);
    } else {
      setEditing(null);
      setForm({ name: "", description: "", image: "" });
      setPreview("");
    }
    setShowModal(true);
  };

  // 🔹 Upload ảnh
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Lưu danh mục
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Tên danh mục không được để trống!");
      return;
    }
    try {
      if (editing) {
        await axiosAdmin.put(`/category/${editing._id}`, form);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await axiosAdmin.post("/category", form);
        toast.success("Thêm danh mục thành công!");
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error("Lỗi khi lưu danh mục!");
    }
  };

  // 🔹 Xóa danh mục
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
    try {
      await axiosAdmin.delete(`/category/${id}`);
      toast.success("Đã xóa danh mục!");
      fetchCategories();
    } catch (err) {
      toast.error("Lỗi khi xóa danh mục!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🗂️ Quản lý danh mục
      </h2>

      {/* Thanh tìm kiếm + nút thêm */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:border-[#f93] w-80 outline-none placeholder:text-[1rem] text-[1.2rem]"
            value={keyword}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#f93] text-white px-4 py-2 rounded-lg hover:bg-[#e7822b]"
        >
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      {/* Bảng danh mục */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Ảnh</th>
              <th className="px-4 py-2 text-left">Tên danh mục</th>
              <th className="px-4 py-2 text-left">Mô tả</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length > 0 ? (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{cat.name}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {cat.description || "—"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => openModal(cat)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-md"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Không có danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal thêm/sửa danh mục */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-[8px] p-[20px] shadow-lg">
            <h2 className="text-[1.8rem] font-semibold mb-4">
              {editing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h2>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-600">
                Ảnh danh mục
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-md px-2 py-1"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-[180px] object-cover rounded-md"
                />
              )}

              <label className="text-sm font-medium text-gray-600 mt-3">
                Tên danh mục
              </label>
              <input
                type="text"
                placeholder="Nhập tên danh mục"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />

              <label className="text-sm font-medium text-gray-600 mt-3">
                Mô tả
              </label>
              <textarea
                placeholder="Nhập mô tả (tuỳ chọn)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
