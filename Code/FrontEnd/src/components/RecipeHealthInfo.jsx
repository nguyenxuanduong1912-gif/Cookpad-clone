import React from "react";
import {
  CheckCircle,
  XCircle,
  Heart,
  Droplet,
  Leaf,
  Shield,
  AlertTriangle,
  Flame,
  Bone,
  Wand2,
} from "lucide-react";

// Tooltip đơn giản bằng Tailwind
const Tooltip = ({ text, children }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
      <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-md">
        {text}
      </div>
      <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
    </div>
  </div>
);

export default function RecipeHealthInfo({
  verified,
  dietaryTags = {},
  poisonRisk = null,
}) {
  const {
    isProteinRich,
    isFiberRich,
    isLowCarb,
    isLowCalorie,
    isLowSugar,
    isHeartHealthy,
    isDiabeticFriendly,
    isRenalFriendly,
    isHighFat,
    isWarningHighSodium,
    isWarningHighFat,
    isWarningHighCalorie,
  } = dietaryTags;

  const healthTags = [
    {
      label: "Giàu đạm",
      icon: <Bone size={18} />,
      active: isProteinRich,
      desc: "Hàm lượng protein cao, hỗ trợ phát triển cơ bắp.",
    },
    {
      label: "Giàu chất xơ",
      icon: <Leaf size={18} />,
      active: isFiberRich,
      desc: "Nhiều chất xơ, tốt cho tiêu hóa.",
    },
    {
      label: "Low Carb",
      icon: <Shield size={18} />,
      active: isLowCarb,
      desc: "Ít tinh bột, phù hợp người muốn giảm cân.",
    },
    {
      label: "Ít đường",
      icon: <Heart size={18} />,
      active: isLowSugar,
      desc: "Hàm lượng đường thấp.",
    },
    {
      label: "Ít calo",
      icon: <Flame size={18} />,
      active: isLowCalorie,
      desc: "Tổng lượng calo thấp, phù hợp ăn kiêng.",
    },
    {
      label: "Tốt cho tim mạch",
      icon: <Heart size={18} />,
      active: isHeartHealthy,
      desc: "Ít cholesterol và natri.",
    },
    {
      label: "Phù hợp người tiểu đường",
      icon: <Wand2 size={18} />,
      active: isDiabeticFriendly,
      desc: "Ít đường và tinh bột.",
    },
    {
      label: "Phù hợp bệnh thận",
      icon: <Droplet size={18} />,
      active: isRenalFriendly,
      desc: "Ít natri, ít đạm – phù hợp người bệnh thận.",
    },
  ];

  const warningTags = [
    {
      label: "Cảnh báo: Nhiều chất béo",
      icon: <AlertTriangle size={18} />,
      active: isHighFat || isWarningHighFat,
      desc: "Hàm lượng chất béo cao, nên ăn điều độ.",
    },
    {
      label: "Cảnh báo: Nhiều muối",
      icon: <AlertTriangle size={18} />,
      active: isWarningHighSodium,
      desc: "Natri cao – không tốt cho tim mạch và huyết áp.",
    },
    {
      label: "Cảnh báo: Nhiều calo",
      icon: <AlertTriangle size={18} />,
      active: isWarningHighCalorie,
      desc: "Calo cao – dễ gây tăng cân.",
    },
  ];

  return (
    <div className="mt-4 bg-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm">
      {/* VERIFIED STATUS */}
      <div className="flex items-center mb-4 text-lg">
        {verified ? (
          <>
            <CheckCircle className="text-green-600 mr-2" size={24} />
            <span className="text-green-700 font-semibold">
              Món ăn đã được kiểm chứng bởi Admin
            </span>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 mr-2" size={24} />
            <span className="text-gray-600 font-semibold">
              Món ăn chưa được kiểm chứng
            </span>
          </>
        )}
      </div>

      {/* POISON RISK BLOCK */}
      {poisonRisk?.isRisk && (
        <div className="p-4 mb-4 rounded-xl bg-red-100 border border-red-200 text-red-800">
          <div className="flex items-center gap-2 font-bold text-lg mb-1">
            <AlertTriangle size={22} />⚠ Nguy cơ ngộ độc
          </div>
          <p className="text-sm">{poisonRisk.reason}</p>
        </div>
      )}

      {/* HEALTH TAGS */}
      {verified && (
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800 mb-2 text-lg">
            Đặc điểm dinh dưỡng
          </h3>
          <div className="flex flex-wrap gap-2">
            {healthTags.map(
              (tag, i) =>
                tag.active && (
                  <Tooltip key={i} text={tag.desc}>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-300">
                      {tag.icon}
                      {tag.label}
                    </div>
                  </Tooltip>
                )
            )}
          </div>
        </div>
      )}

      {/* WARNING TAGS */}
      {verified && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-lg">
            Cảnh báo dinh dưỡng
          </h3>
          <div className="flex flex-wrap gap-2">
            {warningTags.map(
              (tag, i) =>
                tag.active && (
                  <Tooltip key={i} text={tag.desc}>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 border border-red-300">
                      {tag.icon}
                      {tag.label}
                    </div>
                  </Tooltip>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
