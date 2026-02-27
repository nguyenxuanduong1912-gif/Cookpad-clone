// File: src/components/TagInput.jsx (Cần tạo file này)

import React, { useState } from "react";

function TagSearch({
  tags,
  setTags,
  placeholder = "Nhập nguyên liệu...",
  maxTags = 20, // Giới hạn số lượng tag
}) {
  const [inputValue, setInputValue] = useState("");

  // --- Xử lý thêm Tag (khi nhấn Enter) ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn chặn form submit
      const newTag = inputValue.trim();

      if (newTag && tags.length < maxTags) {
        // Chuẩn hóa và thêm vào mảng (kiểm tra trùng lặp)
        const normalizedNewTag = newTag.toLowerCase();

        if (!tags.some((tag) => tag.toLowerCase() === normalizedNewTag)) {
          setTags([...tags, newTag]);
          setInputValue("");
        } else {
          // Có thể thêm toast thông báo tag đã tồn tại
          // toast.warn("Nguyên liệu này đã có trong danh sách.");
          setInputValue("");
        }
      }
    }
  };

  // --- Xử lý xóa Tag ---
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      {/* Vùng chứa Tags đã thêm */}
      <div className="flex flex-wrap gap-2 min-h-[40px] items-center p-1 border-b border-gray-200">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-[#f93] text-white text-sm font-medium py-1 px-3 rounded-full"
          >
            <span>{tag}</span>
            {/* Nút xóa tag */}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-white/70 hover:text-white transition duration-150 focus:outline-none"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        ))}

        {/* Input nhập liệu */}
        {tags.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : "Thêm nữa..."}
            className="flex-grow p-1 text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        )}
      </div>

      {/* Thông báo giới hạn */}
      {tags.length >= maxTags && (
        <p className="text-xs text-red-500 mt-1">
          Đã đạt giới hạn {maxTags} nguyên liệu.
        </p>
      )}
    </div>
  );
}

export default TagSearch;
