import axiosClient from "../api/axiosClient";
import { useEffect } from "react";
import { useState } from "react";
import Button from "../components/Button";
import TrendingCard from "../components/TrendingCard";
import Title from "../components/Title";
import RecentlyView from "../components/RecentlyView";
import RecipeCard from "../components/RecipeCard";
import { Modal } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import SearchRecentlyCard from "../components/SearchRecentlyCard";
import RecipeTag from "../components/RecipeTag";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import LoginCard from "../components/LoginCard";
import { useContext } from "react";
import { HistoryContext } from "../context/HistoryContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";
import SurveyModal from "../components/SurveyModal";
import RecipeSearchResult from "../components/RecipeSearchResult";
import SearchSuggestionDropdown from "../components/SearchSuggestionDropdown";
import MinimalIngredientSuggestion from "../components/MinimalIngredientSuggestion";
import CategoryGroupDropdown from "../components/CategoryGroupDropdown";
import SmartIngredientInput from "../components/SmartIngredientInput";

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [searchTrending, setSearchTrending] = useState();
  const [recentView, setRecentview] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [reset, setReset] = useState(false);
  const { user, setUser } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [deleteState, setDeleteState] = useState({
    recentSearch: false,
    recentView: false,
  });

  const [groupId, setGroupId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // const [openHistory, setOpenHistory] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const { openHistory, setOpenHistory } = useContext(HistoryContext);
  const { primaryInput, setPrimaryInput, dataSuggest, setDataSuggest } =
    useOutletContext();
  // File: Home.jsx (Thay thế khối useEffect tìm kiếm theo primaryInput)

  useEffect(() => {
    const input = primaryInput.trim();
    let isMounted = true;

    // Thoát ngay lập tức nếu input rỗng
    if (input === "") {
      setSearchResults([]);
      setVisible2(false);
      setLoading(false); // Đảm bảo loading tắt khi input rỗng
      return;
    }

    // 1. Thiết lập Debounce
    const delayDebounceFn = setTimeout(async () => {
      // Bắt đầu quá trình tìm kiếm sau khi hết thời gian debounce
      if (isMounted) {
        setLoading(true);
        setVisible2(false); // Ẩn kết quả cũ
      }

      try {
        const ingredients = input
          .split(",")
          .map((item) => item.trim())
          .filter((i) => i.length > 0);

        // Nếu không có nguyên liệu hợp lệ sau khi làm sạch, dừng lại
        if (ingredients.length === 0) {
          if (isMounted) {
            setSearchResults([]);
            setVisible2(true);
          }
          return;
        }

        // 2. Gọi API tìm kiếm chính
        const res = await axiosClient.post("/recipes/search-by-ingredients", {
          userId: user?.id,
          ingredients,
        });

        // 3. Cập nhật state nếu component vẫn còn mounted
        if (isMounted) {
          setSearchResults(res.data.recipes);
          // Chỉ hiển thị kết quả nếu có data
          setVisible2(true);
        }
      } catch (error) {
        if (isMounted) {
          setSearchResults([]);
          toast.error(error.response?.data?.message || "Lỗi tìm kiếm xảy ra!");
          setVisible2(false);
        }
      } finally {
        // 4. Kết thúc loading
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 400); // ⬅️ Độ trễ 300ms

    // 5. Cleanup function: Chạy trước khi useEffect chạy lại hoặc component unmount
    return () => {
      isMounted = false; // Vô hiệu hóa request cũ
      clearTimeout(delayDebounceFn); // Hủy bộ đếm thời gian debounce cũ
    };
    // Thêm các dependencies cần thiết
  }, [primaryInput, user, setLoading, setSearchResults, setVisible2]);
  const handleSearch = (keyword) => {
    setPrimaryInput(keyword);
    navigate(`/search?keyword=${primaryInput}`);
    setVisible(false);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSubmitSurvey = async (formData) => {
    try {
      const res = await axiosClient.post("/accounts/preferences", {
        healthCondition: formData.healthCondition,
        targetDiet: formData.dietaryGoal,
        excludeIngredients: formData.allergies,
        userId: user.id,
      });
      console.log(res.data.message);
    } catch (error) {}
  };
  useEffect(() => {
    const getRecipes = async () => {
      try {
        const res = await axiosClient.get("/recipes", {
          params: {
            keyword: "Hà nội",
          },
        });
        const res2 = await axiosClient.get("/recipes/categories");
        console.log(res2.data);
        if (user) {
          const res3 = await axiosClient.get("/recipes/recent-views");
          const res4 = await axiosClient.get("/search/history");
          const res5 = await axiosClient.get(`/accounts/${user.id}`);
          setIsOpen(!res5?.data?.user?.healthPreferences?.surveyCompleted);
          setRecentview(res3.data);
          setRecentSearch(res4.data);
        } else {
          setIsOpen(false);
        }
        setReset(false);
        setSearchTrending(res2.data);
        setRecipes(res.data.recipes || []);
      } catch (error) {
        console.error("Lỗi khi lấy recipes:", error);
      }
    };

    getRecipes();
  }, [reset, user]);
  // Lấy danh sách món đã xem gần đây
  const loadRecentViews = async () => {
    try {
      const res = await axiosClient.get("/recipes/recent-views");
      setRecentview(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Xóa 1 món khỏi danh sách xem gần đây
  const deleteOneRecentView = async (recipeId) => {
    try {
      await axiosClient.delete("/recipes/recent-view", {
        data: { recipeId },
      });

      setRecentview((prev) => ({
        ...prev,
        recipes: prev.recipes.filter((r) => r._id !== recipeId),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Xóa toàn bộ danh sách xem gần đây
  const deleteAllRecentViews = async () => {
    try {
      await axiosClient.delete("/recipes/recent-views");

      setRecentview({ recipes: [] });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* <SurveyModal
        isOpen={isOpen}
        handleClose={handleClose}
        handleSubmitSurvey={handleSubmitSurvey}
      /> */}
      <main className="text-[#606060]">
        <div className="px-[16px] mx-[40px]">
          {/* <div className="w-full mt-[75px] rounded-[6px] bg-[#81b000] p-[8px] flex items-center">
            <p className="m-auto text-white text-center">
              Đăng xuất thành công? Hẹn gặp lại
            </p>
            <Link>
              <img src="close.svg" alt="" className="" />
            </Link>
          </div> */}

          <div className="my-[56px] flex flex-col items-center gap-[24px] pt-[56px]">
            <img
              src="logo_cookpad.png"
              alt=""
              className="w-[224px] h-[61px] object-contain"
            />

            {/* GỢI Ý MÓN THEO NGUYÊN LIỆU (UI MỚI) */}
            <div className="w-full flex justify-center mt-6">
              <SmartIngredientInput />
            </div>
            <section className="w-full">
              <div>
                {/* <div className="text-[#4a4a4a] flex items-center justify-between mb-[16px]">
                  <h1 className="text-[1.8rem] font-semibold">
                    Từ khóa thịnh hành
                  </h1>
                  <span className="text-[1.2rem]">Cập nhật 04:28</span>
                </div> */}

                <Title text={"Danh mục món ăn"} time={""} />
                <div className="grid grid-cols-4 gap-x-[16px] gap-y-[8px] mb-[24px]">
                  {searchTrending?.categories?.length > 0 &&
                    searchTrending.categories
                      .slice(0, 8)
                      .map((s, index) => (
                        <TrendingCard
                          text={s.name}
                          src={s.image}
                          href={`/category/${s._id}`}
                        />
                      ))}
                  {/* 
                  <TrendingCard
                    text={"Thực đơn món ngon mỗi ngày"}
                    src={
                      "https://img-global.cpcdn.com/recipes/ccda21675c3ae602/560x192cq50/photo.webp"
                    }
                  />
                  <TrendingCard
                    text={"Cá"}
                    src={
                      "https://img-global.cpcdn.com/recipes/c9e71403ea8a4fea/560x192cq50/photo.webp"
                    }
                  />
                  <TrendingCard
                    text={"Bánh"}
                    src={
                      "https://img-global.cpcdn.com/recipes/3129e01e8e16efe3/560x192f0.502029_0.5_1.0q50/photo.webp"
                    }
                  />
                  <TrendingCard
                    text={"Trứng"}
                    src={
                      "https://img-global.cpcdn.com/recipes/1cf68e76e462eb8c/560x192f0.500306_0.5_1.0q50/photo.webp"
                    }
                  />
                  <TrendingCard
                    text={"Đậu hũ"}
                    src={
                      "https://img-global.cpcdn.com/recipes/af4a00ea96579b35/560x192cq50/photo.webp"
                    }
                  />
                  <TrendingCard
                    text={"Ức gà sốt"}
                    src={
                      "https://img-global.cpcdn.com/recipes/8349e5d53c3f7298/560x192f0.5_0.500105_1.0q50/photo.webp"
                    }
                  />
                  <TrendingCard
                    text={"Lá lốt"}
                    src={
                      "https://img-global.cpcdn.com/recipes/add2d6160ccdf800/560x192cq50/photo.webp"
                    }
                  /> */}
                </div>
                <Modal open={visible} onClose={() => setVisible(false)}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-[24px] rounded-[8px] w-[600px] max-h-[80vh] overflow-y-auto">
                    <h2 className="text-[1.8rem] font-semibold mb-[16px]">
                      Món bạn mới xem gần đây
                    </h2>

                    {recentView?.recipes?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-[16px]">
                        {recentView.recipes.map((r, index) => (
                          <RecentlyView
                            key={index}
                            src={r.image}
                            avatar={r?.author?.avatar}
                            name={r?.author?.fullName}
                            decription={r.name}
                            href={`/recipes/${r._id}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <p>Không có món nào gần đây.</p>
                    )}
                  </div>
                </Modal>
                <Modal open={open} onClose={() => setOpen(false)}>
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  bg-[#f6f2ea] w-[420px] max-h-[80vh] p-[24px] rounded-[12px] 
                  shadow-lg overflow-y-auto"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-[16px]">
                      <h2 className="text-[1.8rem] font-semibold text-[#4a4a4a]">
                        Tìm kiếm gần đây của bạn
                      </h2>
                      <button onClick={() => setOpen(false)}>
                        <img src="close.svg" alt="close" className="w-[20px]" />
                      </button>
                    </div>

                    {/* Danh sách lịch sử */}
                    <div className="flex flex-col gap-[12px]">
                      {recentSearch?.history?.length > 0 ? (
                        recentSearch.history.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-[8px] p-[12px] flex justify-between items-center 
                      shadow-sm border border-[#e5e5e5]"
                          >
                            <div>
                              <p className="text-[1.4rem] font-semibold">
                                {item.keyword}
                              </p>
                              <p className="text-[1.2rem] text-[#888]">
                                {item.timeAgo}
                              </p>
                            </div>

                            <button
                              onClick={() => console.log("delete history")}
                            >
                              <img src="close.svg" className="w-[18px]" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>Không có lịch sử tìm kiếm gần đây.</p>
                      )}
                    </div>
                  </div>
                </Modal>

                {recentView?.recipes?.length > 0 && (
                  <Title
                    text={"Món bạn mới xem gần đây"}
                    arrow="arrow.svg"
                    handleOnCLick={() => {
                      setVisible(true);
                      console.log(visible);
                    }}
                  />
                )}

                <div className="grid grid-cols-6 gap-[16px]">
                  {recentView?.recipes?.length > 0 &&
                    recentView.recipes
                      .slice(0, 6)
                      .map((r, index) => (
                        <RecentlyView
                          key={index}
                          src={r.image}
                          avatar={r?.author?.avatar}
                          name={r?.author?.fullName}
                          decription={r.name}
                          href={`/recipes/${r._id}`}
                        />
                      ))}
                </div>
              </div>
              <div className="my-[24px]">
                <Title text={"Gói Premium"} icon={"premium2.svg"} />
              </div>

              <div className="grid grid-cols-3 gap-[16px] mb-[24px]">
                <RecipeCard
                  src={
                    "https://global-web-assets.cpcdn.com/assets/premium/premium_feature/hall_of_fame_recipes-c88c0c3e9b0a9baec1fcd84c066cc9c78eb79f44d4848ba4bac890e5e90e3786.webp"
                  }
                  href={"/"}
                  text={"Top Món Có Nhiều Cooksnap Nhất"}
                  description={"Công thức đã nhận được hơn 10 cooksnap"}
                />

                <RecipeCard
                  src={
                    "https://global-web-assets.cpcdn.com/assets/premium/premium_feature/meal_plans-682dc62344237d32f8878778b750c3d1df25892066375df420b5de4b6c24432f.webp"
                  }
                  href={"/"}
                  text={"Thực Đơn Premium"}
                  description={
                    "Thực đơn hàng tuần với những nguyên liệu theo mùa"
                  }
                />

                <RecipeCard
                  src={
                    "https://global-web-assets.cpcdn.com/assets/premium/premium_feature/access_rankings-a00e64c1f8635b8c1c34eaf988550afe8a389e92e5940ce77d5314833fdd5703.webp"
                  }
                  href={"/"}
                  text={"Top Món Được Xem Nhiều Nhất"}
                  description={
                    "Những công thức có lượt xem nhiều nhất, cập nhật mỗi ngày"
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
