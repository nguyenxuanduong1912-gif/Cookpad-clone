import React from "react";
import { Link } from "react-router-dom";

const nutritionCategories = [
  // LỢI ÍCH
  {
    key: "isProteinRich",
    label: "Giàu Protein",
    icon: "💪",
    color: "from-orange-50 to-orange-100",
  },
  {
    key: "isFiberRich",
    label: "Giàu Chất Xơ",
    icon: "🥬",
    color: "from-green-50 to-emerald-100",
  },
  {
    key: "isLowCarb",
    label: "Ít Carb (Low Carb)",
    icon: "🍚",
    color: "from-slate-50 to-gray-100",
  },
  {
    key: "isLowSugar",
    label: "Ít Đường",
    icon: "🍭",
    color: "from-pink-50 to-red-50",
  },
  {
    key: "isLowCalorie",
    label: "Ít Calo",
    icon: "⚡",
    color: "from-purple-50 to-purple-100",
  },
  {
    key: "isHeartHealthy",
    label: "Tốt cho tim mạch",
    icon: "❤️",
    color: "from-red-50 to-rose-100",
  },
  {
    key: "isDiabeticFriendly",
    label: "Tốt cho người tiểu đường",
    icon: "🩸",
    color: "from-blue-50 to-indigo-100",
  },
  {
    key: "isRenalFriendly",
    label: "Tốt cho bệnh thận",
    icon: "🩺",
    color: "from-indigo-50 to-blue-100",
  },
];

export default function NutritionCategories() {
  return (
    <main className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold text-slate-800 text-center mb-6">
        Danh mục Dinh Dưỡng
      </h1>

      <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mb-10">
        Chọn nhóm dinh dưỡng phù hợp để xem các món tốt cho sức khỏe hoặc cần
        cảnh báo khi sử dụng.
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {nutritionCategories.map((cat) => (
          <Link
            key={cat.key}
            to={`/nutrition/${cat.key}`}
            className={`flex items-center gap-5 p-6 rounded-3xl bg-gradient-to-br ${cat.color}
              shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="text-5xl">{cat.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {cat.label}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Xem các món phù hợp với nhóm này.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
