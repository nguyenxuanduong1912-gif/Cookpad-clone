// File: src/components/SearchSuggestionDropdown.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const SuggestionItem = ({ keyword, isIngredient = false, onClick }) => {
  return (
    <div
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition duration-150 border-b border-gray-50 last:border-b-0"
      onClick={onClick}
    >
      {/* Biểu tượng */}
      <span className="text-gray-500 mr-3 text-lg">
        {isIngredient ? "🥦" : "🔍"}
      </span>
      {/* Từ khóa */}
      <span className="text-gray-800 font-medium">{keyword}</span>
      {/* Nhãn loại */}
      {isIngredient && (
        <span className="ml-auto text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
          Nguyên liệu
        </span>
      )}
    </div>
  );
};

function SearchSuggestionDropdown({
  dataSuggest = [],
  setInputValue,
  setVisible,
  onSearch,
}) {
  const navigate = useNavigate();

  const handleSelect = (keyword) => {
    setInputValue(keyword); // Cập nhật input value
    setVisible(false); // Ẩn dropdown
    onSearch(keyword); // Kích hoạt tìm kiếm hoặc chuyển hướng
  };

  if (dataSuggest.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center text-sm">
        Không tìm thấy gợi ý nào.
      </div>
    );
  }

  return (
    <div className="py-2">
      <h4 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">
        GỢI Ý TỪ KHÓA / NGUYÊN LIỆU
      </h4>
      {dataSuggest.map((item, index) => (
        <SuggestionItem
          key={index}
          keyword={item.keyword}
          // Giả định API trả về trường 'type'
          isIngredient={item.type === "ingredient"}
          onClick={() => handleSelect(item.keyword)}
        />
      ))}

      {/* Nút xem tất cả kết quả */}
      <div
        className="border-t border-gray-100 mt-2 p-3 text-sm text-center text-[#f93] hover:text-[#e8812c] cursor-pointer"
        onClick={() => handleSelect(dataSuggest[0].keyword)}
      >
        Xem tất cả kết quả cho "{dataSuggest[0].keyword}"
      </div>
    </div>
  );
}

export default SearchSuggestionDropdown;
