import { Link, useOutletContext } from "react-router-dom";
import RecipeTag from "../components/RecipeTag";
import RecipeTrending from "../components/RecipeTrending";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/UserContext";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import RecipeSearchResult from "../components/RecipeSearchResult";
function Search() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [similarSearch, setSimilarSearch] = useState([]);
  const [keyword, setkeyWord] = useState("");
  const { user, setUser } = useContext(userContext);
  const { openLogin, setOpenLogin } = useOutletContext();
  const [includeValue, setIncludeValue] = useState("");
  const [excludeValue, setExcludeValue] = useState("");
  const [isSave, setSave] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSaveRecipe = async (userId, recipeId) => {
    try {
      const res = await axiosClient.put("/recipes/saveRecipe", {
        userId: userId,
        recipeId: recipeId,
      });
      const isSave = res.data.recipe.savedBy.some(
        (re) => re.userId === user.id
      );
      setSave(isSave);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleGetMyRecipe = (recipe, userId) => {
    const isMy = recipe?.createdBy?._id === userId;
    return isMy;
  };
  const handleFilterInclude = async () => {
    const res = await axiosClient.get(
      `/recipes/filter/include?ingredients=${includeValue}`
    );
    setData(res.data);
  };

  const handleFilterExclude = async () => {
    const res = await axiosClient.get(
      `/recipes/filter/exclude?ingredients=${excludeValue}`
    );
    setData(res.data);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword");
    setkeyWord(keyword);
    const fetchData = async () => {
      try {
        setLoading(true);
        const ingredients = keyword.split(",").map((item) => item.trim());
        const res = await axiosClient.post("/recipes/search-by-ingredients", {
          ingredients,
          userId: user?.id,
        });
        console.log(123);
        setData(res.data);
        setSearchResults(res.data.recipes);
        const res2 = await axiosClient.get("/recipes/similarSearch", {
          params: { keyword },
        });
        setSimilarSearch(res2.data);
        if (user) {
          await axiosClient.post("/search/history", {
            keyword,
          });
        }
      } catch (error) {
        // console.log(error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSave, user]);
  return (
    <div className="w-[1146px] mx-auto px-[24px] text-[#4a4a4afc]">
      <div>
        <ul className="flex items-center text-[1.4rem] font-semibold text-[#4a4a4afc]">
          <li className="relative">
            <Link className="block p-[16px] hover:opacity-60 before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-[#f93] before:bottom-0 before:left-0">
              Mới nhất
            </Link>
          </li>
          <li className="relative">
            <Link className="flex items-center p-[16px]">
              <img src="premium2.svg" alt="" />
              <span className="hover:opacity-60"> Phổ biến</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* <div className="py-[16px] flex items-center gap-[4px]">
        <h1 className="text-[2.4rem] font-semibold">{keyword}</h1>
        <span className="text-[1.9rem] text-gray-400">
          {`(${data?.recipes?.length > 0 ? data.recipes.length : 0})`}
        </span>
      </div> */}
      <div className="grid grid-cols-1 grid-flow-col gap-[24px]">
        <div className="">
          {/* {data?.recipes?.length <= 0 ? (
            <div className="mx-[45px] py-[24px] flex items-center justify-center flex-col">
              <img src="no_recipes.svg" alt="" className="mb-[16px]" />
              <p className="text-[2rem] font-semibold">
                Không thấy món bạn muốn
              </p>
              <p className="mt-[8px] text-[1.4rem] text-[#606060]">
                Hãy tìm một món khác nhé!
              </p>
            </div>
          ) : (
            <div className="mb-[16px] flex items-center text-[1.9rem] gap-[5px]">
              <img src="premium2.svg" alt="" />
              <span>Món '{keyword}' có lượt xem cao nhất</span>
            </div>
          )} */}

          {/* <div className="overflow-x-hidden w-full">
            <ul className="flex items-center gap-[8px] pb-[16px]">
              {data?.topRecipes?.length > 0 &&
                data.topRecipes.map((r, index) => (
                  <li className="relative overflow-hidden w-[24%] h-[125px] flex-shrink-0">
                    <Link
                      to={`/recipes/${r._id}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={index < 4 && `rank${index + 1}.svg`}
                        alt=""
                        className="absolute"
                      />
                      <img
                        src={r.image}
                        alt=""
                        className="rounded-[8px] w-full h-full object-cover"
                      />
                    </Link>
                  </li>
                ))}
             
            </ul>
          </div> */}
          <div className="flex flex-col gap-[8px]">
            {/* Hiển thị kết quả */}
            <div className="mt-8">
              {loading ? (
                <p className="text-center">Đang tải kết quả...</p>
              ) : (
                <RecipeSearchResult recipes={searchResults} />
              )}
            </div>
            {/* {data?.recipes?.length > 0 &&
              data.recipes.map((r, index) => (
                <RecipeTag
                  text={r.name}
                  src={r.image}
                  ingredients={r.ingredients || []}
                  minute={r.cookTime}
                  person={r.servings}
                  avatar={r?.createdBy?.avatar}
                  name={r?.createdBy?.fullName}
                  nodot={true}
                  handleSaveRecipe={handleSaveRecipe}
                  userId={user?.id}
                  recipeId={r._id}
                  saved={r?.savedBy?.some((r) => r.userId.includes(user?.id))}
                  isSave={isSave}
                  myRecipe={handleGetMyRecipe(r, user?.id)}
                  link={`/recipes/${r._id}`}
                  search={true}
                  user={user}
                  setOpenLogin={setOpenLogin}
                />
              ))} */}
          </div>
          {/* <div className="mt-[24px] mb-[40px]">
            <div className="flex items-center gap-[4px] text-[1.9rem] font-semibold text-[#4A4A4A] mb-[16px]">
              <h3 className="">Từ Kho Món Ngon Của Bạn</h3>
              <span className="text-[#939290] font-medium">(1)</span>
            </div>
            <RecipeTag
              text={"Cơm nhà với nhiều nguyên liệu"}
              src={
                "https://img-global.cpcdn.com/recipes/3f7c3266f132eacc/260x320f0.5_0.5_1.0q50/c%C6%A1m-nha-v%E1%BB%9Bi-nhi%E1%BB%81u-nguyen-li%E1%BB%87u-recipe-main-photo.webp"
              }
              ingredients={
                "Sườn non lăn bột chiên giòn Trứng chiên tép khô hải sản Canh gân bò nấu chua Tráng miệng yaourt và mận"
              }
              minute={60}
              person={3}
              avatar={
                "https://img-global.cpcdn.com/users/af3869a553276076/48x48cq50/avatar.webp"
              }
              name={"Annie Vo"}
              nodot={true}
            />
          </div> */}
          {/* <div className="flex flex-col gap-[15px]">
            <RecipeTag
              text={"Cơm nhà với nhiều nguyên liệu"}
              src={
                "https://img-global.cpcdn.com/recipes/3f7c3266f132eacc/260x320f0.5_0.5_1.0q50/c%C6%A1m-nha-v%E1%BB%9Bi-nhi%E1%BB%81u-nguyen-li%E1%BB%87u-recipe-main-photo.webp"
              }
              ingredients={
                "Sườn non lăn bột chiên giòn Trứng chiên tép khô hải sản Canh gân bò nấu chua Tráng miệng yaourt và mận"
              }
              minute={60}
              person={3}
              avatar={
                "https://img-global.cpcdn.com/users/af3869a553276076/48x48cq50/avatar.webp"
              }
              name={"Annie Vo"}
              nodot={true}
            />
            <RecipeTag
              text={"Vị cơm nhà"}
              src={
                "https://img-global.cpcdn.com/recipes/423c1044a537b024/600x852f0.5_0.5_1.0q80/v%E1%BB%8B-c%C6%A1m-nha-recipe-main-photo.webp"
              }
              ingredients={
                "Thịt quay kho đơn giản Canh mồng tơi nấu thịt xay Cà ri gà Bòn bon Bánh"
              }
              minute={60}
              person={3}
              avatar={
                "https://img-global.cpcdn.com/users/af3869a553276076/48x48cq50/avatar.webp"
              }
              name={"Annie Vo"}
              nodot={true}
            />
            <RecipeTag
              text={"Cơm nhà hai món đơn giản"}
              src={
                "https://img-global.cpcdn.com/recipes/9e9ed50af6e73bbf/600x852f0.5_0.5_1.0q80/c%C6%A1m-nha-hai-mon-d%C6%A1n-gi%E1%BA%A3n-recipe-main-photo.webp"
              }
              ingredients={
                "Thịt nướng bơ mật ong Canh rong biển nấu thịt xay và tép khô Bánh và trái cây tráng miệng"
              }
              minute={60}
              person={3}
              avatar={
                "https://img-global.cpcdn.com/users/af3869a553276076/48x48cq50/avatar.webp"
              }
              name={"Annie Vo"}
              nodot={true}
            />
            <RecipeTag
              text={"Mâm Cơm Chay Đơn Giản Rằm Tháng 7 - Lễ Vu Lan"}
              src={
                "https://img-global.cpcdn.com/recipes/b1b73fc45ac8733f/600x852f0.509955_0.5_1.0q80/mam-c%C6%A1m-chay-d%C6%A1n-gi%E1%BA%A3n-r%E1%BA%B1m-thang-7-l%E1%BB%85-vu-lan-recipe-main-photo.webp"
              }
              ingredients={
                "Nấm bào ngư kho nước tương tiêu xanh Cải rổ xào nấm mèo Canh nấm bào ngư cà chua đậu hũ non Trái cây: quýt, sapoche, thanh long, bơ"
              }
              minute={60}
              person={3}
              avatar={
                "https://img-global.cpcdn.com/users/cf350f88589e7075/80x80cq50/avatar.webp"
              }
              name={"Bòn bon"}
              nodot={true}
            />
          </div> */}
          {similarSearch?.suggestions?.length > 0 && (
            <div className="pt-[16px]">
              <div className="mt-[8px] mb-[16px] flex items-center gap-[16px]">
                <img src="recipe_speech_bubble.svg" alt="" />
                <div>
                  <h3 className="text-[1.6rem] text-[#4A4A4A] font-semibold">
                    Vẫn chưa biết nấu gì?
                  </h3>
                  <p className="text-[1.4rem] text-[#606060]">
                    Tìm các món <span className="font-semibold">{keyword}</span>{" "}
                    phổ biến khác
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-[8px]">
            {similarSearch?.suggestions?.length > 0 &&
              similarSearch.suggestions.map((s, index) => (
                <RecipeTrending
                  key={s._id}
                  keyword={s.text}
                  src={s.image}
                  link={`/search?keyword=${s.text}`}
                />
              ))}

            {/* <RecipeTrending
              keyword={"thực đơn món ngon mỗi ngày"}
              suggest={"miền tây"}
              src={
                "https://img-global.cpcdn.com/recipes/6f8b6e089e284aed/456x536cq80/photo.webp"
              }
            />
            <RecipeTrending
              keyword={"thực đơn món ngon mỗi ngày"}
              suggest={"mưa"}
              src={
                "https://img-global.cpcdn.com/recipes/d816c183286b53ca/456x536cq80/photo.webp"
              }
            />
            <RecipeTrending
              keyword={"thực đơn món ngon mỗi ngày"}
              suggest={"cá"}
              src={
                "https://img-global.cpcdn.com/recipes/265ff4a940029259/456x536cq80/photo.webp"
              }
            />
            <RecipeTrending
              keyword={"thực đơn món ngon mỗi ngày"}
              suggest={"gà"}
              src={
                "https://img-global.cpcdn.com/recipes/cf513f49d9958b65/456x536cq80/photo.webp"
              }
            />
            <RecipeTrending
              keyword={"thực đơn món ngon mỗi ngày"}
              suggest={"với bò"}
              src={
                "https://img-global.cpcdn.com/recipes/037a2d1444fa947a/456x536f0.5_0.501018_1.0q80/photo.webp"
              }
            /> */}
          </div>
        </div>
        <div className="w-[350px] pt-[8px]">
          <div className="sticky top-[54px] h-[650px] overflow-y-auto">
            <div className="pt-[16px] px-[16px] border-b-[1px]">
              <p className="mb-[24px] text-[1.8rem] font-semibold text-[#4A4A4A]">
                Tìm kiếm tương tự
              </p>
              <div className="mb-[24px]">
                {similarSearch?.suggestions?.length > 0 ? (
                  similarSearch.suggestions.map((s, index) => (
                    <a
                      href={`/search?keyword=${s.text}`}
                      key={s._id}
                      className="px-[16px] mr-[4px] mb-[8px] block bg-[#ecebe9] text-[#606060] rounded-[8px] text-center"
                    >
                      {s.text}
                    </a>
                  ))
                ) : (
                  <span>Không có tìm kiếm tương tự</span>
                )}

                {/* <Link className="px-[16px] mr-[4px] mb-[8px] block bg-[#ecebe9] text-[#606060] rounded-[8px] text-center">
                  thực đơn món ngon mỗi ngày miền tây
                </Link>
                <Link className="px-[16px] mr-[4px] mb-[8px] block bg-[#ecebe9] text-[#606060] rounded-[8px] text-center">
                  thực đơn món ngon mỗi ngày mưa
                </Link>
                <Link className="px-[16px] mr-[4px] mb-[8px] block bg-[#ecebe9] text-[#606060] rounded-[8px] text-center">
                  thực đơn món ngon mỗi ngày cá
                </Link>
                <Link className="px-[16px] mr-[4px] mb-[8px] block bg-[#ecebe9] text-[#606060] rounded-[8px] text-center">
                  thực đơn món ngon mỗi ngày gà
                </Link> */}
              </div>
            </div>
            <div className="pt-[24px] px-[16px] pb-[16px]">
              <div className="flex items-center justify-between">
                <p className="text-[1.8rem] font-semibold">Sàng lọc</p>
                <p className="text-[#939290]">Bỏ sàng lọc</p>
              </div>

              <div className="mt-[16px]">
                <p>Hiển thị các món với</p>
                <div className="mt-[16px] flex items-center w-full border p-[4px] rounded-[5px] gap-[8px] pr-[10px]">
                  <img src="search.svg" alt="" />
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Gõ vào tên các nguyên liệu"
                    className="outline-none placeholder:text-[1.5rem] flex-1"
                    value={includeValue}
                    onChange={(e) => setIncludeValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFilterInclude();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="mt-[16px]">
                <p>Hiển thị các món không có</p>
                <div className="mt-[16px] flex items-center w-full border p-[4px] rounded-[5px] gap-[8px] pr-[10px]">
                  <img src="search.svg" alt="" />
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Gõ vào tên các nguyên liệu"
                    className="outline-none placeholder:text-[1.5rem] flex-1"
                    value={excludeValue}
                    onChange={(e) => setExcludeValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFilterExclude();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="px-[16px] pt-[24px] pb-[40px] bg-[#fff3d8]">
              <Link>
                <div className="flex items-center">
                  <img src="premium2.svg" alt="" className="mr-[4px]" />
                  <span className="text-[1.8rem] font-semibold">
                    Bộ lọc Premium
                  </span>
                  <img src="arrow.svg" alt="" className="ml-auto" />
                </div>
              </Link>
              <div className="mt-[24px] flex items-start justify-between text-[1.5rem]">
                <span>Hiển thị các món có hình trong từng bước</span>
                <label htmlFor="checkbox" className="relative">
                  <input
                    type="checkbox"
                    name=""
                    id="checkbox"
                    className="flex-shrink-0 appearance-none w-[48px] h-[24px] bg-white cursor-pointer rounded-[99999px] border border-gray-300 peer checked:bg-green-400 checked:border-green-400"
                  />
                  <span className="absolute w-[24px] h-[24px] bg-white border border-gray-300 rounded-[50%] top-0 right-[24px] cursor-pointer peer-checked:translate-x-[24px]"></span>
                </label>
              </div>
              <div className="mt-[16px] text-[1.5rem] flex items-start justify-between">
                <span>Món có Cooksnap</span>
                <label htmlFor="cooksnap" className="relative">
                  <input
                    type="checkbox"
                    name=""
                    id="cooksnap"
                    className="flex-shrink-0 appearance-none w-[48px] h-[24px] bg-white cursor-pointer rounded-[99999px] border border-gray-300 peer checked:bg-green-400 checked:border-green-400"
                  />
                  <span className="absolute w-[24px] h-[24px] bg-white border border-gray-300 rounded-[50%] top-0 right-[24px] cursor-pointer peer-checked:translate-x-[24px]"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
