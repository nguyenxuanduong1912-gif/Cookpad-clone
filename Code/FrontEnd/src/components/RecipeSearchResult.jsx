import React from "react";
import { Link } from "react-router-dom";

/* SMALL MODE — for Home dropdown */
const RecipeCardSmall = ({ recipe }) => {
  const id = recipe._id || recipe.recipeId;
  const missing = recipe.missingIngredients || [];
  const match = recipe.matchPercentage ?? null;

  return (
    <Link
      to={`/recipes/${id}`}
      className="
        flex gap-3 p-3 rounded-2xl bg-white 
        hover:bg-orange-50 hover:shadow-md 
        transition-all cursor-pointer border border-orange-100
      "
    >
      {/* IMAGE */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
        <img src={recipe.image} className="w-full h-full object-cover" />
      </div>

      {/* TEXT */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-[15px] text-gray-800 line-clamp-1">
          {recipe.name}
        </span>

        {match != null && (
          <span className="text-[12px] mt-1 px-2 py-[2px] rounded-md bg-green-100 text-green-700 w-fit">
            {match}% phù hợp
          </span>
        )}

        {missing.length > 0 ? (
          <span className="text-[12px] text-red-600 mt-1 truncate">
            ❌ Thiếu:{" "}
            {missing
              .slice(0, 3)
              .map((i) => i.name)
              .join(", ")}
            {missing.length > 3 ? "..." : ""}
          </span>
        ) : (
          <span className="text-[12px] text-green-600 mt-1">
            ✔ Đủ nguyên liệu
          </span>
        )}
      </div>
    </Link>
  );
};

/* LARGE MODE — for Search Page */
const RecipeCardLarge = ({ recipe }) => {
  const id = recipe._id || recipe.recipeId;
  const missing = recipe.missingIngredients || [];
  const match = recipe.matchPercentage ?? null;

  return (
    <Link
      to={`/recipes/${id}`}
      className="
        flex gap-4 p-4 rounded-3xl bg-white border border-orange-200
        shadow-sm hover:shadow-xl hover:-translate-y-[3px]
        transition-all duration-300 cursor-pointer
      "
    >
      {/* IMAGE */}
      <div className="w-36 h-32 rounded-2xl overflow-hidden">
        <img src={recipe.image} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="font-bold text-[20px] text-gray-900 line-clamp-2">
          {recipe.name}
        </h3>

        <div className="flex flex-wrap gap-2 mt-2 text-sm font-semibold">
          {match != null && (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
              🔍 {match}%
            </span>
          )}

          {recipe.cookTime && (
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700">
              ⏱ {recipe.cookTime} phút
            </span>
          )}

          {recipe.servings && (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              🍽 {recipe.servings} khẩu phần
            </span>
          )}
        </div>

        <div className="mt-3">
          {missing.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-red-600 mb-1">
                ❌ Còn thiếu {missing.length} nguyên liệu:
              </p>

              <ul className="list-disc ml-5 text-sm text-gray-700">
                {missing.slice(0, 3).map((item, i) => (
                  <li key={i}>{item.name}</li>
                ))}
              </ul>

              {missing.length > 3 && (
                <p className="text-xs text-gray-500 mt-1">
                  ... và thêm {missing.length - 3} nguyên liệu khác
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-green-600 font-semibold">
              ✔ Đủ nguyên liệu cho món này
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

/* WRAPPER */
export default function RecipeSearchResult({ recipes = [], small = false }) {
  /* EMPTY STATE — SEARCH PAGE ONLY */
  if (recipes.length === 0 && !small) {
    return (
      <div className="text-center p-10 bg-white rounded-3xl shadow">
        <div className="text-6xl">😕</div>
        <p className="text-xl font-bold mt-2">Không tìm thấy món phù hợp</p>
        <p className="text-gray-500 mt-1">
          Hãy thử thay đổi từ khoá hoặc nguyên liệu của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className={`${!small ? "p-6" : ""}`}>
      {!small && (
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
          🍽 {recipes.length} món ăn phù hợp
        </h2>
      )}

      <div className="flex flex-col gap-4">
        {recipes.map((recipe) =>
          small ? (
            <RecipeCardSmall key={recipe.recipeId} recipe={recipe} />
          ) : (
            <RecipeCardLarge key={recipe.recipeId} recipe={recipe} />
          )
        )}
      </div>
    </div>
  );
}
