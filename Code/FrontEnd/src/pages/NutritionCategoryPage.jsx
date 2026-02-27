import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const TAG_LABELS = {
  isProteinRich: "Giàu Protein",
  isFiberRich: "Giàu Chất Xơ",
  isLowCarb: "Ít Carb (Low Carb)",
  isLowCalorie: "Ít Calo",
  isLowSugar: "Ít Đường",
  isHeartHealthy: "Tốt cho tim mạch",
  isDiabeticFriendly: "Tốt cho người tiểu đường",
  isRenalFriendly: "Tốt cho bệnh thận",

  // warnings
  isHighFat: "⚠ Nhiều chất béo",
  isWarningHighSodium: "⚠ Nhiều muối",
  isWarningHighFat: "⚠ Chất béo cao",
  isWarningHighCalorie: "⚠ Nhiều calo",

  poisonRisk: "⚠ Nguy cơ ngộ độc",
};

export default function NutritionCategoryPage() {
  const { key } = useParams(); // ví dụ: isProteinRich
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const label = TAG_LABELS[key] || "Dinh dưỡng";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // API filter theo tag dinh dưỡng
        const res = await axiosClient.get(
          `/recipes/filter/nutrition?tag=${key}`
        );

        setRecipes(res.data?.recipes || []);
      } catch (error) {
        console.error("Lỗi tải:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [key]);

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 flex items-center gap-2">
        {label}
      </h1>

      <p className="text-slate-600 mb-6 text-lg">
        Các món ăn phù hợp với tiêu chí dinh dưỡng: <strong>{label}</strong>
      </p>

      {loading && (
        <p className="text-slate-500 text-lg mt-8">Đang tải dữ liệu...</p>
      )}

      {!loading && recipes.length === 0 && (
        <p className="text-slate-500 text-lg mt-8">
          Không có món nào phù hợp với tiêu chí này.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-6">
        {recipes.map((rec) => (
          <Link
            key={rec._id}
            to={`/recipes/${rec._id}`}
            className="flex gap-5 p-5 bg-white border border-orange-200 rounded-3xl
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={rec.image}
              alt={rec.name}
              className="w-40 h-32 rounded-2xl object-cover shadow-md"
            />

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 line-clamp-2">
                  {rec.name}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {rec.cookTime > 0 && (
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                      ⏱ {rec.cookTime} phút
                    </span>
                  )}

                  {rec.servings > 0 && (
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                      🍽 {rec.servings} phần
                    </span>
                  )}

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                    ✔ {label}
                  </span>

                  {/* Nếu là cảnh báo, thêm màu đỏ */}
                  {key.includes("Warning") || key.includes("High") ? (
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                      ⚠ Cảnh báo dinh dưỡng
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Tác giả: {rec.createdBy?.fullName || "Không rõ"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
