import { useState, useMemo, useEffect } from "react";
import { Eye, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import CommentDetailModal from "../components/CommentDetailModal";
import axiosAdmin from "../../api/axiosAdmin";

export default function CommentsFake() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const [comment, setComment] = useState([]);
  const limited = 2;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecipe, setTotalRecipe] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosAdmin.get("/comment/comments", {
          params: { limit: limited, page },
        });
        setData(res.data);
        setComment(res.data);
        console.log(res.data);
      } catch (error) {}
    };

    fetchData();
  }, [page]);

  const [selectedComment, setSelectedComment] = useState(null);

  const handleGetComment = async (e) => {
    const keyword = e.target.value;
    if (!keyword) {
      setComment(data);
      return;
    }
    try {
      setPage(1);
      const res = await axiosAdmin.get("/comment/comments/search", {
        params: { keyword, limit: limited, page },
      });
      setComment(res.data);
    } catch (error) {}
  };
  const handleDeleteComment = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này không?")) return;
    try {
      await axiosAdmin.delete(`/comment/comments/${id}`);
      setComment((pre) => ({
        ...pre,
        comments: pre.comments.filter((c) => c._id !== id),
        total: pre.total - 1,
      }));
      toast.success("Đã xóa bình luận!");
    } catch (error) {
      toast.success("Lỗi xóa bình luận!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        💬 Quản lý bình luận
      </h2>

      {/* Tìm kiếm */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Người dùng, món ăn hoặc nội dung..."
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:border-[#f93] w-80 outline-none placeholder:text-[1rem] text-[1.2rem]"
            onInput={handleGetComment}
          />
        </div>
      </div>

      {/* Bảng bình luận */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Người bình luận</th>
              <th className="px-4 py-2 text-left">Món ăn</th>
              <th className="px-4 py-2 text-left">Nội dung</th>
              <th className="px-4 py-2 text-left">Ngày tạo</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {comment?.comments?.length > 0 &&
              comment?.comments.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img
                      src={c.userId.avatar || "/avatar-default.png"}
                      alt={c.userId.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{c.userId.fullName}</span>
                  </td>
                  <td className="px-4 py-2">{c.recipeId.name}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{c.content}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedComment(c)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

            {comment?.total === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Không có bình luận phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {comment?.totalPages >= 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Trước
          </button>
          {Array.from({ length: comment?.totalPages }, (_, i) => i + 1).map(
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
            onClick={() => setPage((p) => Math.min(p + 1, comment?.totalPages))}
            disabled={page === comment?.totalPages}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {selectedComment && (
        <CommentDetailModal
          comment={selectedComment}
          onClose={() => setSelectedComment(null)}
        />
      )}
    </div>
  );
}
