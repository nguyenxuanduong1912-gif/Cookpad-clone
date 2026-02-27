import React from "react";
import { Link } from "react-router-dom";

export default function RecipeMatchCard({ recipe }) {
  if (!recipe) return null;

  const {
    recipeId,
    name,
    image,
    matchPercentage,
    missingIngredients = [],
    servings,
    servingsPossible,
    hasEnoughForAtLeastOne,
  } = recipe;

  const previewMissing = missingIngredients.slice(0, 3);
  const extraMissingCount =
    missingIngredients.length > 3 ? missingIngredients.length - 3 : 0;

  return (
    <Link
      to={`/recipes/${recipeId}`}
      className="flex gap-4 p-4 rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-md transition duration-150 group"
    >
      {/* IMAGE */}
      <div className="w-28 h-24 rounded-xl overflow-hidden bg-orange-50 shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            Không có ảnh
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Tên món */}
        <h3 className="font-semibold text-lg text-slate-800 line-clamp-2">
          {name}
        </h3>

        {/* Thống kê match */}
        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          {typeof matchPercentage === "number" && (
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">
              🔍 {matchPercentage}% phù hợp
            </span>
          )}

          {typeof servings === "number" && servings > 0 && (
            <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600">
              👨‍🍳 Công thức gốc: {servings} khẩu phần
            </span>
          )}

          {typeof servingsPossible === "number" && servingsPossible >= 1 && (
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium">
              🍽 Bạn có thể nấu ~ {servingsPossible} khẩu phần
            </span>
          )}

          {typeof servingsPossible === "number" && servingsPossible < 1 && (
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600">
              ❌ Nguyên liệu chưa đủ để nấu trọn vẹn
            </span>
          )}
        </div>

        {/* Nguyên liệu còn thiếu */}
        <div className="mt-1">
          {missingIngredients.length === 0 ? (
            <p className="text-xs md:text-sm text-green-700 bg-green-50 inline-block px-2 py-1 rounded-lg">
              ✅ Bạn đã có đủ nguyên liệu cho món này
            </p>
          ) : (
            <>
              <p className="text-xs md:text-sm text-slate-500 mb-1">
                Nguyên liệu còn thiếu:
              </p>
              <div className="flex flex-wrap gap-1">
                {previewMissing.map((ing, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs md:text-sm text-slate-700"
                  >
                    {ing.name}
                    {ing.quantity
                      ? ` (${ing.quantity}${ing.unit ? " " + ing.unit : ""})`
                      : ""}
                  </span>
                ))}

                {extraMissingCount > 0 && (
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-600">
                    + {extraMissingCount} nguyên liệu nữa
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ICON */}
      <div className="self-center text-2xl text-slate-300 group-hover:text-orange-400 transition">
        ➡️
      </div>
    </Link>
  );
}
