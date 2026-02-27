import { Dialog } from "@headlessui/react";
import { CheckCircle } from "lucide-react";
import axiosAdmin from "../../api/axiosAdmin";
import { useEffect, useRef } from "react";

export default function VerifyResultModal({
  open,
  onClose,
  data,
  data2,
  onResetData,
  setReloadTrigger,
  recipeId,
}) {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!open || hasFetched.current) return;
    hasFetched.current = true;

    const handleReset = async () => {
      try {
        const updated = await axiosAdmin.get(`/recipe/detail/${recipeId}`);
        onResetData && onResetData(updated.data);
        setReloadTrigger((prev) => prev + 1);
      } catch (err) {
        console.error("❌ Lỗi khi load lại công thức:", err);
      }
    };

    handleReset();
  }, [open, recipeId, onResetData, setReloadTrigger]);

  useEffect(() => {
    if (!open) hasFetched.current = false;
  }, [open]);

  if (!data && !data2) return null;

  const { nutritionalInfo, dietaryTags, poisonRisk, verificationInfo } =
    data || data2;

  if (!nutritionalInfo || !dietaryTags || !verificationInfo) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full p-7">
        {/* TITLE */}
        <Dialog.Title className="text-3xl font-bold mb-4 flex items-center gap-3">
          <CheckCircle className="text-green-500" size={32} />
          Kết quả kiểm chứng công thức
        </Dialog.Title>

        {/* BLOCK: THÔNG TIN DINH DƯỠNG */}
        <div className="mb-6">
          <h3 className="font-semibold text-xl text-gray-800 mb-3">
            Thông tin dinh dưỡng (trên 1 phần)
          </h3>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-lg text-gray-700">
            <li>
              🔥 Calories: <b>{nutritionalInfo.calories}</b> kcal
            </li>
            <li>
              🍭 Đường: <b>{nutritionalInfo.sugar}</b> g
            </li>
            <li>
              🥔 Carbs: <b>{nutritionalInfo.carbs}</b> g
            </li>
            <li>
              🥑 Chất béo: <b>{nutritionalInfo.fat}</b> g
            </li>
            <li>
              🍗 Protein: <b>{nutritionalInfo.protein}</b> g
            </li>
            <li>
              🧂 Sodium: <b>{nutritionalInfo.sodium}</b> mg
            </li>
            <li>
              🩸 Cholesterol: <b>{nutritionalInfo.cholesterol}</b> mg
            </li>
            <li>
              🌾 Fiber: <b>{nutritionalInfo.fiber}</b> g
            </li>
          </ul>
        </div>

        {/* BLOCK: NGUY CƠ NGỘ ĐỘC */}
        {poisonRisk?.isRisk && (
          <div className="p-4 mb-6 rounded-xl bg-red-100 border border-red-300 text-red-800">
            <p className="font-bold text-xl mb-1">⚠ Nguy cơ ngộ độc</p>
            <p className="text-base">{poisonRisk.reason}</p>
          </div>
        )}

        {/* BLOCK: TAG DINH DƯỠNG */}
        <div className="mb-6">
          <h3 className="font-semibold text-xl text-gray-800 mb-3">
            Đánh giá dinh dưỡng
          </h3>

          <div className="flex flex-wrap gap-2 text-base">
            <Tag label="Giàu Protein" active={dietaryTags.isProteinRich} />
            <Tag label="Giàu chất xơ" active={dietaryTags.isFiberRich} />
            <Tag label="Ít Carb (Low Carb)" active={dietaryTags.isLowCarb} />
            <Tag label="Ít đường" active={dietaryTags.isLowSugar} />
            <Tag label="Ít calo" active={dietaryTags.isLowCalorie} />
            <Tag label="Tốt cho tim mạch" active={dietaryTags.isHeartHealthy} />
            <Tag
              label="Tốt cho tiểu đường"
              active={dietaryTags.isDiabeticFriendly}
            />
            <Tag label="Tốt cho thận" active={dietaryTags.isRenalFriendly} />

            {/* Cảnh báo */}
            <Tag
              label="Nhiều chất béo"
              active={dietaryTags.isHighFat}
              warning
            />
            <Tag
              label="⚠ Nhiều muối"
              active={dietaryTags.isWarningHighSodium}
              warning
            />
            <Tag
              label="⚠ Nhiều chất béo"
              active={dietaryTags.isWarningHighFat}
              warning
            />
            <Tag
              label="⚠ Nhiều calo"
              active={dietaryTags.isWarningHighCalorie}
              warning
            />
          </div>
        </div>

        {/* BLOCK: METADATA */}
        <div className="border-t pt-4 text-sm text-gray-500">
          <p>
            <b>Nguồn:</b> {verificationInfo.source}
          </p>
          <p>
            <b>Xác minh ngày:</b>{" "}
            {new Date(verificationInfo.verifiedAt).toLocaleString("vi-VN")}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition text-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function Tag({ label, active, warning }) {
  if (!active) return null;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${
        warning
          ? "bg-red-100 text-red-700 border-red-300"
          : "bg-green-100 text-green-700 border-green-300"
      }`}
    >
      {label}
    </span>
  );
}
