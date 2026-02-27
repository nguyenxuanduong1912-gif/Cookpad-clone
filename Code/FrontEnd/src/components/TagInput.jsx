import { useState } from "react";

function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");
  // Thêm tag khi nhấn Enter hoặc Space
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInput("");
      }
    }
  };

  // Xóa tag khi click dấu X
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="my-4">
      <label htmlFor="tags" className="block mb-2 font-semibold text-[#4A4A4A]">
        Nhập tag để công thức được đề xuất nhiều hơn
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[1.4rem]"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-2 text-orange-500 hover:text-orange-700 font-bold"
              type="button"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <input
        id="tags"
        type="text"
        name="tags"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tag và nhấn Enter..."
        className="w-full px-3 py-2 border-[1px] border-transparent rounded-md focus:outline-none focus:border-[#f93] bg-[#f8f5f1]"
      />
    </div>
  );
}

export default TagInput;
