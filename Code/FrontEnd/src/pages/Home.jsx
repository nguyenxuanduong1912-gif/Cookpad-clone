import axiosClient from "../api/axiosClient";
import { useEffect, useState, useContext } from "react";
import { Modal } from "@mui/material";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { toast } from "react-toastify";

import Button from "../components/Button";
import TrendingCard from "../components/TrendingCard";
import Title from "../components/Title";
import RecentlyView from "../components/RecentlyView";
import RecipeCard from "../components/RecipeCard";
import SearchRecentlyCard from "../components/SearchRecentlyCard";
import RecipeTag from "../components/RecipeTag";
import LoginCard from "../components/LoginCard";
import SurveyModal from "../components/SurveyModal";
import RecipeSearchResult from "../components/RecipeSearchResult";
import SearchSuggestionDropdown from "../components/SearchSuggestionDropdown";
import MinimalIngredientSuggestion from "../components/MinimalIngredientSuggestion";
import CategoryGroupDropdown from "../components/CategoryGroupDropdown";
import SmartIngredientInput from "../components/SmartIngredientInput";
import CategoryListSkeleton from "../components/CategoryListSkeleton";
import RecentlyViewedList from "../components/RecentlyViewedList";

import { HistoryContext } from "../context/HistoryContext";
import { userContext } from "../context/UserContext";

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [searchTrending, setSearchTrending] = useState();
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [recentView, setRecentview] = useState([]);
  const [isLoadingRecentView, setIsloadingRecentView] = useState(false);
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
  const [openLogin, setOpenLogin] = useState(false);
  const { openHistory, setOpenHistory } = useContext(HistoryContext);
  const { primaryInput, setPrimaryInput, dataSuggest, setDataSuggest } =
    useOutletContext();

  useEffect(() => {
    const input = primaryInput.trim();
    let isMounted = true;

    if (input === "") {
      setSearchResults([]);
      setVisible2(false);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      if (isMounted) {
        setLoading(true);
        setVisible2(false);
      }

      try {
        const ingredients = input
          .split(",")
          .map((item) => item.trim())
          .filter((i) => i.length > 0);

        if (ingredients.length === 0) {
          if (isMounted) {
            setSearchResults([]);
            setVisible2(true);
          }
          return;
        }

        const res = await axiosClient.post("/recipes/search-by-ingredients", {
          userId: user?.id,
          ingredients,
        });

        if (isMounted) {
          setSearchResults(res.data.recipes);
          setVisible2(true);
        }
      } catch (error) {
        if (isMounted) {
          setSearchResults([]);
          toast.error(error.response?.data?.message || "Lỗi tìm kiếm xảy ra!");
          setVisible2(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounceFn);
    };
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
    setIsLoadingCategory(true);
    setIsloadingRecentView(true);
    const getRecipes = async () => {
      try {
        const res = await axiosClient.get("/recipes", {
          params: {
            keyword: "Hà nội",
          },
        });
        const res2 = await axiosClient.get("/recipes/categories");
        if (user) {
          const res3 = await axiosClient.get("/recipes/recent-views");
          const res4 = await axiosClient.get("/search/history");
          const res5 = await axiosClient.get(`/accounts/${user.id}`);
          setIsOpen(!res5?.data?.user?.healthPreferences?.surveyCompleted);
          setRecentview(res3.data);
          setRecentSearch(res4.data);
          setIsloadingRecentView(false);
        } else {
          setIsOpen(false);
        }
        setReset(false);
        setSearchTrending(res2.data);
        setRecipes(res.data.recipes || []);
        setIsLoadingCategory(false);
      } catch (error) {
        console.error("Lỗi khi lấy recipes:", error);
      }
    };

    getRecipes();
  }, [reset, user]);

  const loadRecentViews = async () => {
    try {
      const res = await axiosClient.get("/recipes/recent-views");
      setRecentview(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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
      <main className="text-[#606060]">
        <div className="px-4 md:px-10 max-w-[1280px] mx-auto">
          <div className="my-8 md:my-14 flex flex-col items-center gap-6 pt-10 md:pt-14">
            <img
              src="logo_cookpad.png"
              alt=""
              className="w-40 md:w-56 h-auto object-contain"
            />

            <div className="w-full flex justify-center mt-4 md:mt-6">
              <SmartIngredientInput />
            </div>

            <section className="w-full">
              <Title text={"Danh mục món ăn"} time={""} />
              {isLoadingCategory && <CategoryListSkeleton />}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {searchTrending?.categories?.length > 0 &&
                  searchTrending.categories.slice(0, 8).map((s, index) => (
                    <TrendingCard
                      key={index}
                      text={s.name}
                      src={s.image}
                      href={`/category/${s._id}`}
                    />
                  ))}
              </div>

              {isLoadingRecentView && <RecentlyViewedList />}

              <Modal open={visible} onClose={() => setVisible(false)}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl md:text-3xl font-semibold mb-4 text-[#4a4a4a]">
                    Món bạn mới xem gần đây
                  </h2>

                  {recentView?.recipes?.length > 0 && !isLoadingRecentView ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f6f2ea] w-[90%] md:w-[420px] max-h-[80vh] p-6 rounded-xl shadow-lg overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#4a4a4a]">
                      Tìm kiếm gần đây
                    </h2>
                    <button onClick={() => setOpen(false)}>
                      <img src="close.svg" alt="close" className="w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {recentSearch?.history?.length > 0 ? (
                      recentSearch.history.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-3 flex justify-between items-center shadow-sm border border-[#e5e5e5]"
                        >
                          <div>
                            <p className="text-sm md:text-base font-semibold">
                              {item.keyword}
                            </p>
                            <p className="text-xs text-[#888]">{item.timeAgo}</p>
                          </div>
                          <button onClick={() => console.log("delete history")}>
                            <img src="close.svg" className="w-4" />
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
                  handleOnCLick={() => setVisible(true)}
                />
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {recentView?.recipes?.length > 0 &&
                  recentView.recipes.slice(0, 6).map((r, index) => (
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

              <div className="my-6 md:my-8">
                <Title text={"Gói Premium"} icon={"premium2.svg"} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 md:mb-8">
                <RecipeCard
                  src="https://global-web-assets.cpcdn.com/assets/premium/premium_feature/hall_of_fame_recipes-c88c0c3e9b0a9baec1fcd84c066cc9c78eb79f44d4848ba4bac890e5e90e3786.webp"
                  href="/"
                  text="Top Món Có Nhiều Cooksnap Nhất"
                  description="Công thức đã nhận được hơn 10 cooksnap"
                />

                <RecipeCard
                  src="https://global-web-assets.cpcdn.com/assets/premium/premium_feature/meal_plans-682dc62344237d32f8878778b750c3d1df25892066375df420b5de4b6c24432f.webp"
                  href="/"
                  text="Thực Đơn Premium"
                  description="Thực đơn hàng tuần với những nguyên liệu theo mùa"
                />

                <RecipeCard
                  src="https://global-web-assets.cpcdn.com/assets/premium/premium_feature/access_rankings-a00e64c1f8635b8c1c34eaf988550afe8a389e92e5940ce77d5314833fdd5703.webp"
                  href="/"
                  text="Top Món Được Xem Nhiều Nhất"
                  description="Những công thức có lượt xem nhiều nhất, cập nhật mỗi ngày"
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