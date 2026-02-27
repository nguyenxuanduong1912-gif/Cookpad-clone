import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Title from "../components/Title";

// Icon auto detection
const getCategoryIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("canh")) return "🥣";
  if (lower.includes("xào") || lower.includes("xao")) return "🥦";
  if (lower.includes("chiên") || lower.includes("rán")) return "🍤";
  if (lower.includes("kho")) return "🍲";
  if (lower.includes("nướng") || lower.includes("nuong")) return "🍗";
  if (lower.includes("chay") || lower.includes("vegan")) return "🥗";
  if (lower.includes("tráng miệng")) return "🍰";
  return "🍽️";
};

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/recipes/categories")
      .then((res) => setCategories(res.data?.categories || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <Title text="Danh mục món ăn" />
      <p className="text-lg text-slate-600 mt-2">
        Khám phá các nhóm món được thiết kế trực quan, giúp bạn tìm ý tưởng nấu
        ăn nhanh và thông minh hơn.
      </p>

      {loading ? (
        <div className="text-center text-lg text-gray-500 py-10">
          Đang tải danh mục...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat._id}`}
              className="
                group flex items-center gap-6 p-6 rounded-3xl
                bg-gradient-to-br from-white to-orange-50
                border border-orange-200
                hover:border-orange-400 hover:shadow-2xl hover:-translate-y-1
                transition-all duration-300
              "
            >
              {/* Icon */}
              <div
                className="
                text-5xl md:text-6xl 
                bg-white shadow-md rounded-2xl 
                w-20 h-20 md:w-24 md:h-24
                flex items-center justify-center
                group-hover:scale-110 transition-transform
              "
              >
                {getCategoryIcon(cat.name)}
              </div>

              {/* Image */}
              <div
                className="
                w-28 h-20 md:w-32 md:h-24 rounded-2xl overflow-hidden
                shadow-md bg-slate-100 flex-shrink-0
              "
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="
                      w-full h-full object-cover 
                      group-hover:scale-110 transition-transform duration-300
                    "
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <h3
                  className="
                  text-xl md:text-2xl font-semibold 
                  text-slate-800 group-hover:text-orange-600 
                  transition-colors
                "
                >
                  {cat.name}
                </h3>

                {cat.description && (
                  <p className="text-base text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <div
                className="
                hidden md:block text-3xl text-orange-400
                group-hover:translate-x-1 transition-transform
              "
              >
                →
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
