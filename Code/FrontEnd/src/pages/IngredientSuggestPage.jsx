import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import Title from "../components/Title";
import { Link } from "react-router-dom";

export default function IngredientSuggestPage() {
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (i) => {
    const updated = ingredients.filter((_, idx) => idx !== i);
    setIngredients(
      updated.length ? updated : [{ name: "", quantity: "", unit: "" }]
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    const clean = ingredients.filter((i) => i.name.trim() !== "");
    if (!clean.length) {
      setError("Vui lòng nhập ít nhất 1 nguyên liệu.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post("/recipes/search-by-ingredients", {
        ingredients: clean,
      });
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lấy dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-4 py-6 max-w-5xl mx-auto">
      {/* TIÊU ĐỀ */}
      <Title text="Tìm món ăn theo nguyên liệu bạn đang có" />

      <p className="text-base text-slate-700 mb-4">
        Nhập các nguyên liệu bạn đang có và số lượng. Hệ thống sẽ gợi ý món ăn
        phù hợp, kèm tỷ lệ trùng khớp và số khẩu phần bạn có thể nấu.
      </p>

      {/* FORM */}
      <form
        onSubmit={submitHandler}
        className="bg-white border border-orange-200 shadow-sm rounded-3xl p-6 space-y-5"
      >
        {ingredients.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-orange-50 p-4 rounded-2xl border border-orange-100"
          >
            <input
              type="text"
              className="px-4 py-3 rounded-xl border text-lg focus:ring-2 ring-orange-300"
              placeholder="Tên nguyên liệu (vd: thịt heo)"
              value={item.name}
              onChange={(e) =>
                handleIngredientChange(index, "name", e.target.value)
              }
            />

            <input
              type="number"
              className="px-4 py-3 rounded-xl border text-lg focus:ring-2 ring-orange-300"
              placeholder="Số lượng"
              value={item.quantity}
              onChange={(e) =>
                handleIngredientChange(index, "quantity", e.target.value)
              }
            />

            <input
              type="text"
              className="px-4 py-3 rounded-xl border text-lg focus:ring-2 ring-orange-300"
              placeholder="Đơn vị (g, ml, quả...)"
              value={item.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-red-500 text-lg hover:text-red-600"
            >
              ✖ Xóa
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addIngredient}
          className="px-4 py-3 bg-orange-100 font-semibold rounded-xl text-orange-700 hover:bg-orange-200 transition"
        >
          ➕ Thêm nguyên liệu
        </button>

        {error && (
          <p className="text-lg text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="px-6 py-3 bg-orange-500 text-white font-bold text-xl rounded-full hover:bg-orange-600 transition w-full md:w-auto"
          disabled={loading}
        >
          {loading ? "Đang tìm món..." : "🔎 Tìm món ăn phù hợp"}
        </button>
      </form>

      {/* KẾT QUẢ */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Kết quả gợi ý ({recipes.length} món)
        </h2>

        {loading && <p className="text-lg text-gray-600">Đang tải...</p>}

        {!loading && recipes.length === 0 && (
          <p className="text-lg text-gray-500">
            Chưa có kết quả. Hãy nhập nguyên liệu và tìm kiếm nhé.
          </p>
        )}

        <div className="space-y-4 mt-4">
          {recipes.map((r) => (
            <Link
              key={r.recipeId || r._id}
              to={`/recipes/${r.recipeId || r._id}`}
              className="block bg-white border border-orange-100 shadow-sm rounded-3xl p-5 flex gap-4 items-center hover:shadow-lg hover:-translate-y-[2px] transition-all"
            >
              {/* IMAGE */}
              <div className="w-32 h-24 rounded-xl overflow-hidden bg-orange-50">
                {r.image ? (
                  <img src={r.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    Không có ảnh
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <h3 className="font-bold text-xl text-slate-800 line-clamp-2">
                  {r.name}
                </h3>

                <div className="flex flex-wrap gap-2 mt-2 text-base">
                  {typeof r.matchPercentage === "number" && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                      🔍 {r.matchPercentage}% phù hợp
                    </span>
                  )}

                  {typeof r.servingsPossible === "number" &&
                    r.servingsPossible >= 1 && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        🍽 Nấu được {r.servingsPossible} khẩu phần
                      </span>
                    )}

                  {typeof r.servingsPossible === "number" &&
                    r.servingsPossible < 1 && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                        ❌ Không đủ nguyên liệu
                      </span>
                    )}
                </div>
              </div>

              {/* ICON */}
              <div className="text-3xl">➡️</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
