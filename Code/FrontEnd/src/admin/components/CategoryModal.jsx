import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import axiosAdmin from "@/api/axiosAdmin";

export default function CategoryModal({ open, onClose, category, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    type: category?.type || "loai-mon",
    description: category?.description || "",
    image: category?.image || "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        toast.error("Tên danh mục không được để trống!");
        return;
      }

      if (category?._id) {
        // update
        await axiosAdmin.put(`/categories/${category._id}`, formData);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        // create
        await axiosAdmin.post(`/categories`, formData);
        toast.success("Thêm danh mục thành công!");
      }

      onSave(); // reload list
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi máy chủ!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tên danh mục
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="VD: Món chính, Món chiên, Món chay..."
            />
          </div>

          {/* Loại danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Loại danh mục
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loai-mon">Loại món</SelectItem>
                <SelectItem value="nguyen-lieu">Nguyên liệu</SelectItem>
                <SelectItem value="phuong-phap">Phương pháp</SelectItem>
                <SelectItem value="che-do-an">Chế độ ăn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ảnh minh họa */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ảnh minh họa
            </label>
            <Input
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="Nhập URL ảnh hoặc để trống"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="w-24 h-24 object-cover rounded-lg mt-2 border"
              />
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mô tả
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả ngắn về danh mục..."
            />
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">{category ? "Cập nhật" : "Thêm mới"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
