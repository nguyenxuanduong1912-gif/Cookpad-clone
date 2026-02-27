export default function StatusBadge({ status, user }) {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    approved: "bg-green-100 text-green-700 border-green-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
  };

  const labelMap = {
    pending: "Chờ duyệt",
    approved: user ? "Hoạt động" : "Đã duyệt",
    rejected: user ? "Đã khóa" : "Từ chối",
  };

  return (
    <span
      className={`px-3 py-1.5 border rounded-full text-xs font-semibold transition-all duration-300 ${
        colorMap[status] || "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      {labelMap[status] || "Không xác định"}
    </span>
  );
}
