import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function RecipeTag({
  text,
  src,
  ingredients = [],
  minute,
  person,
  avatar,
  name,
  nodot,
  noInfo,
  draft,
  saved,
  posted,
  createdAt,
  myRecipe,
  savedAt,
  link,
  handleSaveRecipe,
  userId,
  recipeId,
  search,
  bin,
  handleDelete,
  user,
  setOpenLogin,
}) {
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formatted = `${day} tháng ${month} năm ${year}`;
    return formatted;
  };
  const formatMinutesToHours = (minutes) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} tiếng`;
    }

    return `${hours} tiếng ${remainingMinutes} phút`;
  };
  const [isSaved, setIsSaved] = useState(saved || false);
  const toggleSave = async () => {
    try {
      if (!user) {
        setOpenLogin(true);
        return;
      }
      const newSaveState = !isSaved;
      setIsSaved(newSaveState);

      await handleSaveRecipe(userId, recipeId);
    } catch (error) {
      toast("Có lỗi khi lưu công thức!");
      setIsSaved(!isSaved);
    }
  };

  return (
    <Link to={link}>
      <div className="flex rounded-[8px] overflow-hidden shadow-xl">
        <div className="w-[130px] h-[160px] shrink-0 relative">
          <img
            src={
              src
                ? src
                : "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png"
            }
            alt=""
            className="w-full h-full object-cover"
          />
          {draft && (
            <div className="flex items-center gap-[4px] rounded-[6px] bg-[#ecebe9] absolute z-100 bottom-[8px] left-[15px] p-[4px] text-[1.4rem] text-[#676767]">
              <img src="/lock.svg" alt="" className="w-[16px] h-[16px]" />
              <span>Món nháp</span>
            </div>
          )}
        </div>
        <div className="p-[16px] hover:bg-[#F8F6F2] flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <div className="">
              <h2 className="text-[1.9rem] font-semibold line-clamp-1">
                {text ? text : "Không đề"}
              </h2>
            </div>
            <div className="flex items-center gap-[2px]">
              {!draft && !myRecipe && !bin && (
                <img
                  src={isSaved ? "/save.svg" : "/unsave.svg"}
                  alt={isSaved ? "Bỏ lưu" : "Lưu công thức"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSave();
                  }}
                />
              )}

              {/* <img src="saved.svg" alt="" /> */}
              {!bin && !nodot && <img src="/threedot.svg" alt="" />}
              {bin && (
                <img
                  src="/bin.svg"
                  alt=""
                  className="w-[25px] h-[25px]"
                  onClick={handleDelete}
                />
              )}
            </div>
          </div>
          <p className="text-[1.4rem] line-clamp-2 text-gray-700">
            {Array.isArray(ingredients) && ingredients.length > 0
              ? ingredients.map((ing) => ing.name).join(", ")
              : "Chưa có nguyên liệu"}
          </p>
          {!noInfo && (
            <ul className="flex items-center gap-[15px] mt-[2px]">
              <li className="flex items-center gap-[5px]">
                <img src="/clock.svg" alt="" />
                <span className="text-[1.4rem]">
                  {formatMinutesToHours(minute)}
                </span>
              </li>
              <li className="flex items-center gap-[2px]">
                <img src="/person.svg" alt="" />
                <span className="text-[1.4rem]">{person} người</span>
              </li>
            </ul>
          )}
          <div
            className={`flex items-center gap-[8px] ${
              noInfo ? "mt-[4px]" : "mt-auto"
            }`}
          >
            <img
              src={avatar}
              alt=""
              className="w-[24px] h-[24px] rounded-[50%]"
            />
            <span className="text-[1.4rem] line-clamp-1">{name}</span>
          </div>
          {!search && (
            <div className="mt-auto">
              {saved && (
                <span className="text-[1.4rem] text-[#676767]">
                  Đã lưu {formatDate(savedAt)}
                </span>
              )}
              {draft && (
                <span className="text-[1.4rem] text-[#676767]">
                  Tạo ngày {formatDate(createdAt)}
                </span>
              )}
              {posted && !saved && (
                <span className="text-[1.4rem] text-[#676767]">
                  Lên sóng {formatDate(createdAt)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default RecipeTag;
