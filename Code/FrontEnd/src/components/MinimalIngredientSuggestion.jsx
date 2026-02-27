import React from "react";
import {
  FaClock,
  FaUserFriends,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MinimalIngredientSuggestion({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-10 text-xl text-slate-500 font-medium">
        Không tìm thấy món phù hợp 🙁
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
      {recipes.map((r) => (
        <Link
          key={r.recipeId}
          to={`/recipes/${r.recipeId}`}
          className="flex gap-5 bg-white border border-orange-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          {/* IMAGE */}
          <img
            src={r.image}
            alt={r.name}
            className="w-52 h-40 object-cover rounded-xl shadow-md"
          />

          {/* INFO AREA */}
          <div className="flex-1 flex flex-col justify-between">
            {/* NAME */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {r.name}
              </h2>

              {/* MATCH % */}
              <p className="text-lg text-orange-600 font-semibold mt-2">
                {r.matchPercentage}% phù hợp
              </p>
            </div>

            {/* DETAILS */}
            <div className="flex flex-col gap-2 mt-3">
              {/* COOK TIME */}
              <div className="flex items-center gap-2 text-lg text-slate-700">
                <FaClock className="text-orange-500" />
                <span>
                  Thời gian nấu:{" "}
                  <strong className="text-slate-900">{r.cookTime} phút</strong>
                </span>
              </div>

              {/* SERVINGS */}
              <div className="flex items-center gap-2 text-lg text-slate-700">
                <FaUserFriends className="text-orange-500" />
                <span>
                  Khẩu phần:{" "}
                  <strong className="text-slate-900">
                    {r.servingsPossible > 0
                      ? `${r.servingsPossible} phần`
                      : "Không đủ nguyên liệu"}
                  </strong>
                </span>
              </div>

              {/* MISSING INGREDIENTS */}
              {r.missingIngredients && r.missingIngredients.length > 0 ? (
                <div className="flex items-start gap-2 text-lg text-red-600 mt-1">
                  <FaTimesCircle className="mt-1" />
                  <div>
                    <span className="font-medium">Thiếu nguyên liệu:</span>
                    <ul className="list-disc ml-6 text-base text-red-700">
                      {r.missingIngredients.map((m, i) => (
                        <li key={i}>
                          {m.name} – {m.quantity} {m.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lg text-green-600 mt-1">
                  <FaCheckCircle />
                  <span>Đủ nguyên liệu</span>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-4">
              <p className="text-sm text-slate-500">
                Tác giả: {r.createdBy?.fullName || "Không rõ"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
