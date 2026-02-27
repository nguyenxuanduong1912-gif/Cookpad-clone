import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Title from "../components/Title";

// Icon theo tên danh mục
const getCategoryIcon = (name = "") => {
  const lower = name.toLowerCase();

  if (lower.includes("sáng") || lower.includes("breakfast")) return "☀️";
  if (lower.includes("trưa") || lower.includes("lunch")) return "🌤️";
  if (lower.includes("tối") || lower.includes("dinner")) return "🌙";
  if (lower.includes("canh") || lower.includes("soup")) return "🥣";
  if (
    lower.includes("chiên") ||
    lower.includes("rán") ||
    lower.includes("fried")
  )
    return "🍤";
  if (lower.includes("xào") || lower.includes("stir")) return "🥦";
  if (lower.includes("kho") || lower.includes("om") || lower.includes("rim"))
    return "🍲";
  if (lower.includes("nướng") || lower.includes("grill")) return "🍗";
  if (lower.includes("luộc")) return "🥩";
  if (lower.includes("chay") || lower.includes("vegan")) return "🥗";
  if (lower.includes("tráng miệng")) return "🍰";

  return "🍽️";
};

function CategoryPage() {
  const { id } = useParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      setPage(1);

      try {
        const catRes = await axiosClient.get("/recipes/categories");
        const categories = catRes.data?.categories || [];
        const found = categories.find((c) => c._id === id);
        setCategoryInfo(found || null);

        const recipeRes = await axiosClient.get(`/recipes/by-category/${id}`);
        setRecipes(recipeRes.data?.recipes || []);
      } catch (err) {
        setError("Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const totalPages = Math.max(1, Math.ceil(recipes.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageRecipes = recipes.slice(startIndex, startIndex + PAGE_SIZE);

  const handleChangePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const icon = getCategoryIcon(categoryInfo?.name || "");

  return (
    <main className="px-5 py-10 max-w-6xl mx-auto">
      {/* TITLE */}
      <Title text="Danh mục món ăn" />

      {/* HEADER PREMIUM */}
      <section
        className="mt-3 mb-10 bg-gradient-to-r from-orange-50 via-orange-100/40 to-rose-50 
                          border border-orange-200 rounded-3xl shadow-lg p-8 flex gap-6 items-center"
      >
        {/* Icon */}
        <div
          className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-3xl shadow flex items-center 
                        justify-center text-5xl md:text-6xl"
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {categoryInfo?.name || "Danh mục món ăn"}
          </h1>

          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            Các món ăn được nhóm theo danh mục (canh, xào, chiên, kho, nướng,
            chay, tráng miệng,...) giúp bạn chọn món dễ dàng và thông minh hơn.
          </p>

          {categoryInfo?.description && (
            <p className="mt-2 text-sm md:text-base text-orange-700 italic">
              {categoryInfo.description}
            </p>
          )}
        </div>
      </section>

      {/* STATUS */}
      {loading && (
        <div className="text-center text-lg text-gray-500 py-10">
          Đang tải danh sách món ăn...
        </div>
      )}

      {!loading && error && (
        <div className="text-center text-lg text-red-500 py-10">{error}</div>
      )}

      {/* LIST OF RECIPES */}
      {!loading && !error && (
        <>
          {recipes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">
                Chưa có món nào trong danh mục{" "}
                <span className="font-semibold">{categoryInfo?.name}</span>.
              </p>
            </div>
          ) : (
            <>
              <section className="space-y-6">
                {pageRecipes.map((recipe) => (
                  <article
                    key={recipe._id}
                    className="bg-white border border-orange-200 rounded-3xl p-5 md:p-6 shadow-md 
                               flex gap-5 md:gap-6 items-center
                               hover:shadow-xl hover:-translate-y-1 hover:border-orange-400 
                               transition-all duration-300"
                  >
                    {/* IMAGE */}
                    <div className="w-32 h-24 md:w-40 md:h-32 rounded-2xl overflow-hidden bg-orange-50 flex-shrink-0">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          Không có ảnh
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-semibold text-slate-800 line-clamp-2">
                        {recipe.name}
                      </h3>

                      {recipe.description && (
                        <p className="text-sm md:text-base text-slate-500 mt-1 line-clamp-2">
                          {recipe.description}
                        </p>
                      )}

                      {/* TAGS */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.cookTime > 0 && (
                          <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs md:text-sm rounded-full">
                            ⏱ {recipe.cookTime} phút
                          </span>
                        )}
                        {recipe.servings > 0 && (
                          <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs md:text-sm rounded-full">
                            🍽 {recipe.servings} khẩu phần
                          </span>
                        )}
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs md:text-sm rounded-full">
                          ⭐ Thuộc: {categoryInfo?.name}
                        </span>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="flex flex-col items-end">
                      <Link
                        to={`/recipes/${recipe._id}`}
                        className="px-4 py-2 text-sm md:text-base rounded-full bg-orange-500 text-white 
                                   hover:bg-orange-600 transition-colors"
                      >
                        Xem chi tiết
                      </Link>

                      <span className="text-2xl mt-2">👩‍🍳</span>
                    </div>
                  </article>
                ))}
              </section>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-full border text-sm md:text-base ${
                      page === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-orange-300 text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const p = idx + 1;
                    const active = p === page;

                    return (
                      <button
                        key={p}
                        onClick={() => handleChangePage(p)}
                        className={`w-10 h-10 rounded-full text-sm md:text-base font-medium border ${
                          active
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-orange-200 text-orange-700 hover:bg-orange-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-full border text-sm md:text-base ${
                      page === totalPages
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-orange-300 text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

export default CategoryPage;
