import React, { useContext, useState, useRef, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { userContext } from "../context/UserContext";
import MinimalIngredientSuggestion from "./MinimalIngredientSuggestion";
const DIETARY_OPTIONS = [
  { key: "protein", label: "Giàu Protein", field: "isProteinRich" },
  { key: "fiber", label: "Giàu chất xơ", field: "isFiberRich" },
  { key: "lowcarb", label: "Ít Carb", field: "isLowCarb" },
  { key: "lowsugar", label: "Ít Đường", field: "isLowSugar" },
  { key: "lowcalorie", label: "Ít Calo", field: "isLowCalorie" },
  { key: "heart", label: "Tốt cho tim mạch", field: "isHeartHealthy" },
  {
    key: "diabetic",
    label: "Tốt cho tiểu đường",
    field: "isDiabeticFriendly",
  },
  { key: "renal", label: "Tốt cho thận", field: "isRenalFriendly" },

  // Cảnh báo
  { key: "highfat", label: "⚠ Nhiều chất béo", field: "isHighFat" },
  {
    key: "highsodium",
    label: "⚠ Nhiều muối",
    field: "isWarningHighSodium",
  },
  {
    key: "warningfat",
    label: "⚠ Nhiều chất béo",
    field: "isWarningHighFat",
  },
  {
    key: "highcalo",
    label: "⚠ Nhiều calo",
    field: "isWarningHighCalorie",
  },

  // Ngộ độc
  { key: "poison", label: "⚠ Nguy cơ ngộ độc", field: "poisonRisk" },
];
const ingredientCategories = [
  {
    name: "Thịt",
    icon: "🥩",
    items: ["Thịt bò", "Thịt heo", "Thịt gà", "Sườn", "Thịt xay"],
  },
  {
    name: "Rau củ",
    icon: "🥕",
    items: ["Cà rốt", "Khoai tây", "Cà chua", "Bí đỏ", "Hành tây"],
  },
  {
    name: "Gia vị",
    icon: "🧂",
    items: ["Muối", "Đường", "Tiêu", "Tỏi", "Hành tím", "Nước mắm"],
  },
  { name: "Hải sản", icon: "🍤", items: ["Tôm", "Cá", "Cá hồi", "Mực"] },
  { name: "Đồ khô", icon: "🍜", items: ["Mì", "Bún", "Phở", "Miến"] },
];

export default function SmartIngredientInput() {
  const { user } = useContext(userContext);

  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  const typingTimeoutRef = useRef(null);

  // popup categories
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // FILTER STATE
  const [filters, setFilters] = useState({
    minMatch: 0,
    missingType: "any",
    servingsType: "any",
    cookTime: "any",
    dietary: "any",
  });

  const [sortBy, setSortBy] = useState("finalScore");

  const addTag = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  };

  const addTagFromInput = () => {
    addTag(inputValue);
    setInputValue("");
    setShowSuggest(false);
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const clearAll = () => {
    setTags([]);
    setRecipes([]);
    setInputValue("");
    setError("");
  };

  // AUTOCOMPLETE
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axiosClient.get("/recipes/similarSearch", {
          params: { keyword: inputValue.trim() },
        });
        setSuggestions(res.data?.suggestions || []);
        setShowSuggest(true);
      } catch {
        setSuggestions([]);
      }
    }, 200);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [inputValue]);

  const handleSuggestRecipes = async () => {
    if (tags.length === 0) {
      setError("Vui lòng nhập ít nhất 1 nguyên liệu.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await axiosClient.post("/recipes/search-by-ingredients", {
        ingredients: tags,
        userId: user?.id,
      });
      setRecipes(res.data?.recipes || []);

      if (!res.data?.recipes?.length) {
        setError("Không tìm thấy món nào phù hợp.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // FILTERING + SORTING
  const filteredRecipes = recipes
    .filter((r) => {
      // 1) match %
      if (filters.minMatch > 0 && r.matchPercentage < filters.minMatch) {
        return false;
      }

      // 2) missing ingredients
      const missingCount = r.missingIngredients?.length || 0;
      if (filters.missingType === "none" && missingCount > 0) return false;
      if (filters.missingType === "few" && missingCount > 2) return false;
      if (filters.missingType === "many" && missingCount < 3) return false;

      // 3) servingsPossible
      const sp = r.servingsPossible || 0;
      if (filters.servingsType === "atLeast1" && sp < 1) return false;
      if (filters.servingsType === "atLeast2" && sp < 2) return false;

      // 4) cookTime (backend: r.cookTime)
      if (filters.cookTime === "<15" && r.cookTime > 15) return false;
      if (filters.cookTime === "<30" && r.cookTime > 30) return false;
      if (filters.cookTime === "<60" && r.cookTime > 60) return false;

      // ⭐ FILTER THEO CHẾ ĐỘ DINH DƯỠNG ⭐
      if (filters.dietary && filters.dietary !== "any") {
        const selected = DIETARY_OPTIONS.find((o) => o.key === filters.dietary);
        if (!selected) return false;

        // POISON RISK → không nằm trong dietaryTags
        if (selected.key === "poison") {
          if (!r.poisonRisk || !r.poisonRisk.isRisk) return false;
        } else {
          const dt = r.dietaryTags || {};
          if (!dt[selected.field]) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "finalScore") {
        return (b.finalScore || 0) - (a.finalScore || 0);
      }
      return (b.matchPercentage || 0) - (a.matchPercentage || 0);
    });

  return (
    <>
      {/* MAIN UI BLOCK */}
      <section className="w-full max-w-[1024px] bg-white border border-orange-200 rounded-3xl shadow-md p-8 md:p-10 space-y-8">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[2.2rem] font-semibold text-slate-800">
              Gợi ý món từ nguyên liệu bạn có
            </h2>
            <p className="text-base text-slate-500">
              Nhập nguyên liệu → Enter → Gợi ý món
            </p>
          </div>

          {tags.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1 border border-slate-300 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* INPUT TAG AREA */}
        <div className="relative">
          <div className="border border-orange-300 bg-[#fff9f4] rounded-2xl px-4 py-3 flex flex-wrap gap-3 min-h-[56px] shadow-sm">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-orange-300 text-sm shadow-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-xs text-slate-500 hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}

            <input
              className="flex-1 bg-transparent outline-none min-w-[200px] text-lg"
              placeholder="Ví dụ: thịt bò, cà chua..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (["Enter", ",", "Tab"].includes(e.key)) {
                  e.preventDefault();
                  addTagFromInput();
                }
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggest(true)}
            />

            {/* Category Popup button */}
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 rounded-lg bg-white border border-orange-300 text-orange-600 text-base hover:bg-orange-50"
            >
              + Danh mục
            </button>
          </div>

          {/* AUTOCOMPLETE */}
          {/* {showSuggest && (
            <div className="absolute mt-2 w-full bg-white border border-orange-200 rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onMouseDown={() => {
                    addTag(s.text);
                    setInputValue("");
                    setSuggestions([]);
                    setShowSuggest(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                >
                  {s.text}
                </div>
              ))}
            </div>
          )} */}
        </div>

        {/* POPULAR INGREDIENTS */}
        <div>
          <p className="text-sm text-slate-500 mb-2">Nguyên liệu phổ biến:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Thịt bò",
              "Thịt heo",
              "Thịt gà",
              "Tôm",
              "Trứng",
              "Khoai tây",
              "Cà chua",
              "Tỏi",
              "Hành lá",
              "Gừng",
              "Ớt",
            ].map((item) => (
              <button
                key={item}
                onClick={() => addTag(item)}
                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-sm"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Suggest button */}
        <div className="flex justify-end">
          <button
            onClick={handleSuggestRecipes}
            disabled={loading}
            className="px-6 py-3 rounded-xl text-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow-md disabled:opacity-60"
          >
            {loading ? "Đang gợi ý..." : "Gợi ý món ăn"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* RESULTS + FILTER BAR */}
        {recipes.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Bộ lọc:
              </span>

              {/* FILTER BAR */}
              <div className="flex flex-wrap gap-3 text-sm md:text-base">
                {/* MATCH % */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Match:</span>
                  {[0, 50, 70, 90].map((m) => (
                    <button
                      key={m}
                      onClick={() => setFilters({ ...filters, minMatch: m })}
                      className={`px-2 py-1 rounded-full border ${
                        filters.minMatch === m
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white border-slate-200 hover:bg-orange-50"
                      }`}
                    >
                      {m === 0 ? "Tất cả" : `${m}%+`}
                    </button>
                  ))}
                </div>

                {/* THIẾU NGUYÊN LIỆU */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Thiếu NL:</span>
                  {[
                    { key: "any", label: "Bất kỳ" },
                    { key: "none", label: "0" },
                    { key: "few", label: "≤2" },
                    { key: "many", label: "≥3" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() =>
                        setFilters({ ...filters, missingType: opt.key })
                      }
                      className={`px-2 py-1 rounded-full border ${
                        filters.missingType === opt.key
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white border-slate-200 hover:bg-orange-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* KHẨU PHẦN */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Khẩu phần:</span>
                  {[
                    { key: "any", label: "Bất kỳ" },
                    { key: "atLeast1", label: "≥1" },
                    { key: "atLeast2", label: "≥2" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() =>
                        setFilters({ ...filters, servingsType: opt.key })
                      }
                      className={`px-2 py-1 rounded-full border ${
                        filters.servingsType === opt.key
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white border-slate-200 hover:bg-orange-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* COOK TIME */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Thời gian:</span>
                  {[
                    { key: "any", label: "Tất cả" },
                    { key: "<15", label: "<15p" },
                    { key: "<30", label: "<30p" },
                    { key: "<60", label: "<60p" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() =>
                        setFilters({ ...filters, cookTime: opt.key })
                      }
                      className={`px-2 py-1 rounded-full border ${
                        filters.cookTime === opt.key
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white border-slate-200 hover:bg-orange-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* DIETARY TAGS */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500 font-medium">Chế độ:</span>

                  {[
                    { key: "any", label: "Tất cả" },

                    // Lợi ích
                    { key: "protein", label: "Giàu Protein" },
                    { key: "fiber", label: "Giàu chất xơ" },
                    { key: "lowcarb", label: "Ít Carb" },
                    { key: "lowsugar", label: "Ít Đường" },
                    { key: "lowcalorie", label: "Ít Calo" },
                    { key: "heart", label: "Tốt cho tim mạch" },
                    { key: "diabetic", label: "Tốt cho tiểu đường" },
                    { key: "renal", label: "Tốt cho thận" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() =>
                        setFilters({ ...filters, dietary: opt.key })
                      }
                      className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-1 transition ${
                        filters.dietary === opt.key
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {/* SORT */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Sắp xếp:</span>
                  <button
                    onClick={() => setSortBy("finalScore")}
                    className={`px-2 py-1 rounded-full border ${
                      sortBy === "finalScore"
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white border-slate-200 hover:bg-orange-50"
                    }`}
                  >
                    Đề xuất
                  </button>
                  <button
                    onClick={() => setSortBy("match")}
                    className={`px-2 py-1 rounded-full border ${
                      sortBy === "match"
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white border-slate-200 hover:bg-orange-50"
                    }`}
                  >
                    %Match
                  </button>
                </div>
              </div>
            </div>

            {/* RENDER RESULT */}
            <MinimalIngredientSuggestion recipes={filteredRecipes} />
          </div>
        )}
      </section>

      {/* CATEGORY POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-3xl shadow-2xl w-[92%] max-w-[720px] p-6 space-y-5 relative">
            <button
              className="absolute top-4 right-4 text-xl text-slate-500 hover:text-red-500"
              onClick={() => {
                setShowPopup(false);
                setSelectedCategory(null);
              }}
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold text-center text-slate-800">
              Chọn nguyên liệu
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ingredientCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-4 rounded-2xl border ${
                    selectedCategory?.name === cat.name
                      ? "bg-orange-50 border-orange-300"
                      : "bg-[#fffaf5] border-orange-100 hover:bg-orange-50"
                  }`}
                >
                  <div className="text-3xl">{cat.icon}</div>
                  <p className="font-medium">{cat.name}</p>
                </button>
              ))}
            </div>

            {selectedCategory && (
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-semibold mb-2">
                  {selectedCategory.icon} {selectedCategory.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => addTag(item)}
                      className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 text-base"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
