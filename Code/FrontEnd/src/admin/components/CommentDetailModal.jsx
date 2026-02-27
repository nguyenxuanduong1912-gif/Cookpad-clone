import { X } from "lucide-react";

export default function CommentDetailModal({ comment, onClose }) {
  if (!comment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết bình luận
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={comment.userId.avatar || "/avatar-default.png"}
              alt={comment.userId.fullName}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-lg">{comment.userId.fullName}</p>
              <p className="text-sm text-gray-500">
                Đã bình luận về:{" "}
                <span className="font-medium text-gray-800">
                  {comment.recipeId.name}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-gray-600 whitespace-pre-line">
              {comment.content}
            </p>
          </div>

          <p className="text-sm text-gray-500 text-right">
            Ngày: {new Date(comment.createdAt).toLocaleString("vi-VN")}
          </p>
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
