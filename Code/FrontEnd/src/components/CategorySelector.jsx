// File: src/components/CategorySelector.jsx

import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

/**
 * Component chọn Danh mục cho trang Thêm món ăn
 * * @param {string} value - Category ID hiện tại (ObjectId)
 * @param {function} onChange - Hàm xử lý khi chọn (trả về Category ID)
 * @param {boolean} required - Có bắt buộc chọn hay không
 */
function CategorySelector({ value, onChange, required = true }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách Categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Sử dụng API công khai để lấy danh mục
        const res = await axiosClient.get("/recipes/categories");
        setCategories(res.data.categories || []);
      } catch (error) {
        toast.error("Lỗi khi tải danh mục.");
        console.error("Fetch categories error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", height: 56 }}>
        <CircularProgress size={20} sx={{ color: "#f93" }} />
        <FormHelperText sx={{ ml: 2 }}>Đang tải danh mục...</FormHelperText>
      </Box>
    );
  }

  return (
    <FormControl fullWidth required={required} margin="normal">
      <InputLabel id="category-select-label">Danh mục Món ăn</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={value}
        label="Danh mục Món ăn"
        onChange={(e) => onChange(e.target.value)}
        sx={{
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f93",
          },
        }}
      >
        {/* Tùy chọn mặc định nếu không bắt buộc */}
        {!required && (
          <MenuItem value="">
            <em>(Không chọn)</em>
          </MenuItem>
        )}

        {/* Render danh sách danh mục */}
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Chọn danh mục chính cho công thức này.</FormHelperText>
      {categories.length === 0 && (
        <FormHelperText error>Chưa có danh mục nào được tạo.</FormHelperText>
      )}
    </FormControl>
  );
}

export default CategorySelector;
