import React, { useState } from "react";

export default function IngredientTagInput({ value = [], onChange }) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag) => {
    tag = tag.trim();
    if (!tag) return;

    // không cho trùng
    if (value.includes(tag.toLowerCase())) return;

    onChange([...value, tag.toLowerCase()]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // không reload + không thêm dấu phẩy
      addTag(inputValue);
      setInputValue("");
    }

    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // xóa tag cuối
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="w-full bg-white border border-orange-300 rounded-2xl p-3 flex flex-wrap gap-2 items-center">
      {/* TAGS */}
      {value.map((tag) => (
        <span
          key={tag}
          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-base flex items-center gap-2"
        >
          {tag}
          <button
            className="text-orange-700 hover:text-red-600"
            onClick={() => removeTag(tag)}
          >
            ✖
          </button>
        </span>
      ))}

      {/* INPUT */}
      <input
        type="text"
        className="flex-1 min-w-[120px] text-lg outline-none"
        placeholder="Nhập nguyên liệu và nhấn Enter..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
