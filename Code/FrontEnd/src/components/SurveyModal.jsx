import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
// Giả định bạn đã tạo Component Button tùy chỉnh
// import Button from './Button';

// Dữ liệu mở rộng cho Chế độ ăn uống (Dietary Goals)
const DIETARY_OPTIONS = [
  { value: "none", label: "Không (Ăn uống bình thường)" },
  { value: "keto", label: "Keto" },
  { value: "vegan", label: "Ăn chay thuần (Vegan)" },
  { value: "low_fat", label: "Ít chất béo (Low-fat)" },
  { value: "high_protein", label: "Giàu Protein (Tăng cơ)" },
  { value: "HeartHealthy", label: "Thân thiện với tim mạch" },
];

// Dữ liệu mở rộng cho Bệnh lý/Yêu cầu Sức khỏe (Health Conditions)
const HEALTH_OPTIONS = [
  { value: "none", label: "Khỏe mạnh/Dinh dưỡng tổng quát" },
  { value: "diabetes", label: "Bệnh Tiểu đường" },
  { value: "heart_disease", label: "Bệnh tim mạch (Cần ít Cholesterol)" },
  { value: "kidney_disease", label: "Bệnh Thận" },
  { value: "weight_loss", label: "Mục tiêu Giảm cân/Kiểm soát Calo" },
];

// Component chính
function SurveyModal({ isOpen, handleClose, handleSubmitSurvey }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    healthCondition: "", // Bệnh lý đã chọn
    dietaryGoal: "", // Chế độ ăn đã chọn
    allergies: "", // Chuỗi các nguyên liệu dị ứng
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    // Gửi dữ liệu đã thu thập về Backend
    handleSubmitSurvey(formData);
    handleClose();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550, // Điều chỉnh chiều rộng
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    borderRadius: "12px",
    outline: "none",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // ----------------------------------------------------
  // BƯỚC 1: SỨC KHỎE/BỆNH LÝ
  // ----------------------------------------------------
  const Step1_Health = (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#F93] border-b pb-2">
        Bước 1/3: Yêu cầu Sức khỏe & Bệnh lý
      </h3>
      <p className="mb-6 text-gray-600">
        Thông tin này giúp chúng tôi **loại trừ các món ăn gây hại** và ưu tiên
        món ăn phù hợp.
      </p>
      <div className="space-y-3">
        {HEALTH_OPTIONS.map((option) => (
          <div
            key={option.value}
            className={`p-3 border rounded-lg cursor-pointer transition duration-200 
                        ${
                          formData.healthCondition === option.value
                            ? "bg-[#FFEDE1] border-[#F93] font-semibold"
                            : "hover:bg-gray-50 border-gray-200"
                        }`}
            onClick={() => handleChange("healthCondition", option.value)}
          >
            {option.label}
            {option.value === "diabetes" && (
              <span className="ml-2 text-sm text-red-500">
                (Cần ít Đường/Carb)
              </span>
            )}
            {option.value === "hypertension" && (
              <span className="ml-2 text-sm text-red-500">
                (Cần ít Muối/Natri)
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ----------------------------------------------------
  // BƯỚC 2: CHẾ ĐỘ ĂN KIÊNG/MỤC TIÊU
  // ----------------------------------------------------
  const Step2_Diet = (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#F93] border-b pb-2">
        Bước 2/3: Chế độ Ăn uống & Mục tiêu
      </h3>
      <p className="mb-6 text-gray-600">
        Vui lòng chọn chế độ ăn uống bạn đang theo đuổi để nhận gợi ý chuẩn xác
        nhất.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {DIETARY_OPTIONS.map((option) => (
          <div
            key={option.value}
            className={`p-3 border rounded-lg cursor-pointer transition duration-200 
                        ${
                          formData.dietaryGoal === option.value
                            ? "bg-[#FFEDE1] border-[#F93] font-semibold"
                            : "hover:bg-gray-50 border-gray-200"
                        }`}
            onClick={() => handleChange("dietaryGoal", option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );

  // ----------------------------------------------------
  // BƯỚC 3: DỊ ỨNG & KIÊNG KỊ
  // ----------------------------------------------------
  const Step3_Allergies = (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#F93] border-b pb-2">
        Bước 3/3: Dị ứng & Nguyên liệu Kiêng kị
      </h3>
      <p className="mb-6 text-gray-600">
        Liệt kê các nguyên liệu bạn tuyệt đối phải tránh (ví dụ: Hải sản, Đậu
        phộng, Bột mì,...)
      </p>
      <div className="space-y-3">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#F93] focus:ring focus:ring-[#f93]/20"
          rows="4"
          placeholder="Nhập các nguyên liệu, cách nhau bằng dấu phẩy"
          value={formData.allergies}
          onChange={(e) => handleChange("allergies", e.target.value)}
        />
      </div>
      <p className="mt-4 text-sm text-red-500">
        ⚠ Công thức chứa các nguyên liệu này sẽ bị loại bỏ hoàn toàn khỏi kết
        quả gợi ý.
      </p>
    </div>
  );

  const currentStepComponent = [Step1_Health, Step2_Diet, Step3_Allergies][
    step - 1
  ];

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="survey-modal-title"
    >
      <Box sx={style}>
        <h2
          id="survey-modal-title"
          className="text-2xl font-extrabold mb-6 text-center text-gray-800"
        >
          Chào mừng! 🥳 Hãy thiết lập hồ sơ cá nhân
        </h2>

        {currentStepComponent}

        {/* Footer Điều hướng */}
        <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
          {/* Nút Quay lại */}
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`py-2 px-4 rounded-lg transition duration-200 ${
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            &larr; Quay lại
          </button>

          {/* Nút Tiếp tục / Hoàn thành */}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="bg-[#f93] text-white py-2 px-4 rounded-lg font-bold transition duration-200 hover:bg-[#e8812c]"
            >
              Tiếp tục
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-[#28A745] text-white py-2 px-4 rounded-lg font-bold transition duration-200 hover:bg-[#1e8938]"
            >
              Hoàn thành & Bắt đầu Gợi ý
            </button>
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default SurveyModal;
