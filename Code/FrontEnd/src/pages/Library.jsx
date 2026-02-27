import { Link, useOutletContext } from "react-router-dom";
import RecipeTag from "../components/RecipeTag";
import { TextareaAutosize } from "@mui/material";
import Button from "../components/Button";
import { useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useContext } from "react";
import { userContext } from "../context/UserContext";
function Library() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const { openLogin, setOpenLogin } = useOutletContext();
  const [isSave, setIsSave] = useState(false);
  const { user, setUser } = useContext(userContext);
  const {
    data,
    setData,
    recipes,
    setRecipes,
    homeSearch,
    setHomeSearch,
    searchData,
    inputValue,
    setInputValue,
    originalData,
    setOriginalData,
    inputValueNavbar,
  } = useOutletContext();
  const [status, setStatus] = useState(false);
  useEffect(() => {
    if (!user) return;
    if (homeSearch) {
      setData(searchData);
      setHomeSearch(false);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/recipes/user-recipes");
        const { saved, drafts, published, authored, cooked } = res.data.recipe;
        setRecipes({
          all: [...drafts, ...published, ...saved],
          saved,
          published,
          draft: drafts,
          authored,
          cooked,
        });

        if (source) {
          setData(res.data.recipe[source]);
          setOriginalData(res.data.recipe[source]);
        } else {
          setData([...drafts, ...published, ...saved]);
          setOriginalData([...drafts, ...published, ...saved]);
        }
      } catch (error) {}
    };
    fetchData();
  }, [user, source, homeSearch]);
  const handleGetDate = (recipe, userId) => {
    if (!recipe?.savedBy) return false;
    const saved = recipe.savedBy.find(
      (r) => String(r.userId) === String(userId)
    );
    return saved ? saved.savedAt : false;
  };
  const handleGetMyRecipe = (recipe, userId) => {
    const isMy = recipe.createdBy._id === userId;
    return isMy;
  };
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setData(originalData);
    } else {
      setData(
        originalData.filter((item) =>
          removeVietnameseTones(item.name).includes(
            removeVietnameseTones(value)
          )
        )
      );
    }
  };
  const handleSaveRecipe = async (userId, recipeId) => {
    try {
      const res = await axiosClient.put("/recipes/saveRecipe", {
        userId: userId,
        recipeId: recipeId,
      });
      const isSave = res.data.recipe.savedBy.some(
        (re) => re.userId === user.id
      );
      setIsSave(isSave);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return (
    <>
      <div className="w-[1146px] mx-auto">
        <div className="px-[16px] pb-[24px] grid grid-cols-[1fr,30%] gap-[24px]">
          <div>
            <div className="flex items-center gap-[4px] mb-[8px]">
              <span className="text-[2.4rem] text-[#4a4a4a] font-semibold">
                {!source && "Tất cả"}
                {source === "saved" && "Đã lưu"}
                {source === "cooked" && "Đã nấu"}
                {source === "authored" && "Món của tôi"}
                {source === "published" && "Đã lên sóng"}
                {source === "drafts" && "Món nháp"}
              </span>
              <span className="text-[2rem] text-[#939290]">{`(${data.length})`}</span>
            </div>
            <div className="mb-[16px]">
              <div className="flex items-center gap-[10px]">
                <div className="flex text-[1.6rem] bg-[#f8f6f2] h-[48px] items-center px-[8px] rounded w-[400px]">
                  <img src="/search.svg" alt="" className="mr-[8px]" />
                  <input
                    type="text"
                    placeholder="Tìm trong kho món mon của bạn"
                    name="query"
                    className="border-none outline-none caret-[#f93] w-full bg-transparent placeholder:text-[1.4rem]"
                    value={inputValue}
                    onChange={(e) => {
                      handleSearch(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // ngăn reload
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <ul className="flex flex-col gap-[8px]">
              {data.length > 0 &&
                data.map((recipe, index) => (
                  <>
                    <RecipeTag
                      key={index}
                      src={recipe.image}
                      text={recipe.name}
                      ingredients={recipe.ingredients}
                      minute={recipe.cookTime}
                      person={recipe.servings}
                      avatar={recipe.createdBy.avatar}
                      name={recipe.createdBy.fullName}
                      nodot={true}
                      noInfo={true}
                      draft={recipe.recipeState === "draft"}
                      saved={recipe.savedBy.some((r) =>
                        r.userId.includes(user?.id)
                      )}
                      posted={recipe.recipeState === "published"}
                      createdAt={recipe.createdAt}
                      savedAt={
                        recipe.savedBy?.length > 0 &&
                        handleGetDate(recipe, user?.id)
                      }
                      myRecipe={handleGetMyRecipe(recipe, user?.id)}
                      link={`/recipes/${recipe._id}`}
                      isSave={isSave}
                      userId={user?.id}
                      recipeId={recipe._id}
                      handleSaveRecipe={handleSaveRecipe}
                      user={user}
                      setOpenLogin={setOpenLogin}
                    />
                  </>
                ))}
            </ul>
            {data.length <= 0 && (
              <div className="m-[24px] flex flex-col items-center">
                <img
                  src="https://global-web-assets.cpcdn.com/assets/empty_states/no_results-8613ba06d717993e5429d9907d209dc959106472a8a4089424f1b0ccbbcd5fa9.svg"
                  alt=""
                  className="h-[96px] mb-[16px]"
                />
                <p className="text-[#4a4a4a] font-semibold text-[1.8rem] mb-[8px]">
                  Chưa có công thức nào
                </p>
                <p className="text-[1.4rem] text-[#939290] text-center">
                  Các công thức được tự động xác định là món bạn đã nấu theo sẽ
                  xuất hiện ở đây khi bạn bắt đầu!
                </p>
              </div>
            )}
          </div>
          <div>
            <div className="pt-[8px] sticky top-[65px]">
              <div className="p-[16px]">
                <p className="text-[1.9rem] text-[#4a4a4a] font-semibold">
                  Giúp chúng tôi cải thiện dịch vụ
                </p>
                <div className="mt-[8px] mb-[16px] text-[1.2rem] text-[#606060]">
                  <p>
                    Cookpad luôn không ngừng hoàn thiện dịch vụ để khiến bạn hài
                    lòng hơn. Rất mong nhận được phản hồi của bạn để Cookpad có
                    thể cải thiện tốt hơn.
                  </p>
                  <p>
                    Nếu bạn có câu hỏi hay gặp vấn đề gì, vui lòng mở{" "}
                    <Link className="text-[#f93]">Trang FAQ.</Link>
                  </p>
                </div>

                <div className="flex flex-col items-start gap-[16px]">
                  <TextareaAutosize
                    minRows={3}
                    maxRows={20}
                    placeholder="Vui lòng góp ý của bạn ở đây"
                    className="resize-none outline-none no-scrollbar w-full text-[#606060] bg-transparent border border-transparent p-[8px] bg-[#f3f1ed] rounded-[4px] placeholder:text-[1.2rem] placeholder:text-[#CECECD] focus:border-[#f93]"
                  />

                  <Button
                    text={"Gửi"}
                    px={"16px"}
                    py={"8px"}
                    color={"#f93"}
                    textColor={"#ffff"}
                  />
                </div>
                <p className="pt-[16px] pb-[8px] text-[1.2rem] text-[#606060]">
                  Vui lòng không đưa bất kỳ thông tin nhận dạng cá nhân nào (dữ
                  liệu cá nhân) vào biểu mẫu phản hồi này, bao gồm tên hoặc chi
                  tiết liên hệ của bạn.
                </p>
                <p className="pb-[8px] text-[1.2rem] text-[#606060]">
                  Chúng tôi sẽ sử dụng thông tin này để giúp chúng tôi cải thiện
                  dịch vụ của mình. Bằng cách gửi phản hồi này, bạn đồng ý xử lý
                  thông tin của mình theo{" "}
                  <Link className="underline">Chính Sách Bảo Mật </Link>{" "}
                  <span> </span> và
                  <span> </span>
                  <Link className="underline">Điều Khoản Dịch Vụ</Link>{" "}
                  <span> </span> của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Library;
