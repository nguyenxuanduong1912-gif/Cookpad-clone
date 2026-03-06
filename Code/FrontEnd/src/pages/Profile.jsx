import { Link, useOutletContext } from "react-router-dom";
import Button from "../components/Button";
import { useState } from "react";
import RecipeProfile from "../components/RecipeProfile";
import Friend from "../components/Friend";
import { useEffect } from "react";
import { useContext } from "react";
import { userContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import ProfileSkeleton from "../components/ProfileSkeleton";
function Profile() {
  const { user, setUser } = useContext(userContext);
  const [data, setData] = useState([]);
  const { openLogin, setOpenLogin } = useOutletContext();
  const { id } = useParams();
  const [folowStatus, setFollowStatus] = useState(false);
  const [userinfo, setUserInfo] = useState({});
  const [isMe, setIsMe] = useState(false);
  const [newIngredients, setNewIngregients] = useState([]);
  const [ingreditents, setIngredients] = useState([
    "thịt gà(đùi gà góc tư lọc xương,ức goc tư lọc xương bao gồm cánh)",
    "Gia vị: bột tỏi,bột hành,bột gừng,bột ớt,bột mù tạt,tiêu đen,tiêu trắng,bột nghệ",
    "lá thơm ý,lá oregano,lá basil,ít thyme",
    "sữa chua không đường",
    "bột mì số 8(cake flour) hoặc bột mì đa dụng",
    "bột khoai tây hoặc bột bắp",
    "bột nở",
    "soda không đường để lạnh",
    "rượu vodka(loại 40-50°) để lạnh",
    "lòng trắng trứng",
  ]);
  const [isLoading, setIsLoading] = useState(false)
  const handleFollowing = async (targetId) => {
    try {
      const req = await axiosClient.post("/accounts/following", {
        targetId,
      });
      setFollowStatus(true);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  const handleUnFollowing = async (targetId) => {
    try {
      const req = await axiosClient.delete(`/accounts/unFollowing/${targetId}`);
      setFollowStatus(false);
    } catch (error) {
      toast(error.response.data.message);
    }
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
  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/accounts/${id}/profile`, {
          params: { userId: user?.id },
        });

        setNewIngregients(res.data.ingreditents);
        setUserInfo(res.data.user);
        setData(res.data);
        if (user && res.data.user._id === user.id) {
          setIsMe(true);
        }
        setFollowStatus(res.data.isFollowing);
         setIsLoading(false)
      } catch (error) {
        console.error("Fetch profile error:", error);
      }
    };

    fetchData();
  }, [user, id, folowStatus]);

  const handleNewIngredients = (ingredients) => {
    return ingredients
      .map((ing) => `${ing.quantity} ${ing.unit} ${ing.name}`)
      .join(" ,");
  };
  return (
    <>
    {
      isLoading && <ProfileSkeleton />
    }
      {
        !isLoading && <div className="px-[16px] mx-auto w-[680px]">
        <div className="pt-[16px]">
          <div className="flex items-center gap-[8px]">
            <Link>
              <img
                src={data?.user?.avatar && data.user.avatar}
                alt=""
                className="w-[96px] h-[96px] rounded-[50%] object-contain"
              />
            </Link>
            <div className="ml-[16px]">
              <h1 className="text-[2rem] text-[#4A4A4A] font-semibold">
                {data?.user?.fullName && data.user.fullName}
              </h1>
              {/* <span className="text-[#939290] text-[1.2rem]">
                @manhcooking_1706
              </span> */}
              {data?.user?.address && data.user.address && (
                <div className="flex items-center gap-[2px]">
                  <img
                    src="/location.svg"
                    alt=""
                    className="w-[16px] h-[16px]"
                  />
                  <span className="text-[#939290] text-[1.2rem]">
                    {data.user.address}
                  </span>
                </div>
              )}
            </div>
            <img src="/threedot.svg" alt="" className="ml-auto self-start" />
          </div>

          {data?.user?.description && data.user.description && (
            <div className="py-[8px] mr-[8px]">
              <p className="text-[#606060] line-clamp-2">
                {data.user.description}
              </p>
              <Link className="w-full block text-right text-[#ec702b] hover:underline">
                Xem thêm
              </Link>
            </div>
          )}

          <div className="mt-[8px] flex text-[1.4rem] items-center gap-[25px]">
            <Link>
              <span className="mr-[4px] font-semibold">
                {" "}
                {data?.stats?.followersCount && data.stats.followersCount}
              </span>
              <span className="text-[#939290]">Người theo dõi</span>
            </Link>

            <Link>
              <span className="mr-[4px] font-semibold">
                {" "}
                {data?.stats?.followingCount && data.stats.followingCount}
              </span>
              <span className="text-[#939290]">Đang theo dõi</span>
            </Link>
          </div>

          {!isMe && (
            <div className="mt-[8px]">
              {folowStatus ? (
                <Button
                  text={"Hủy theo dõi"}
                  widthFull
                  px={"40px"}
                  py={"8px"}
                  onClick={() => handleUnFollowing(data.user._id)}
                />
              ) : (
                <Button
                  text={"Theo dõi"}
                  widthFull
                  px={"40px"}
                  py={"8px"}
                  textColor={"#ffff"}
                  color={"#4a4a49"}
                  onClick={() => {
                    if (user) {
                      handleFollowing(data.user._id);
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                />
              )}

              {/* <Link>
              <Button
                text={"Sửa thông tin cá nhân"}
                widthFull
                px={"40px"}
                py={"8px"}
              />
            </Link> */}
            </div>
          )}
        </div>
        {/* <div className="p-[8px]">
          <span className="text-[2.4rem]">
            <span className="font-semibold">51</span> Bạn Bếp
          </span>
        </div> */}
        {/* <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        /> */}
        <div className="mt-[24px] sticky top-[64px] bg-white">
          <div className="p-[16px] border-b-[4px] border-b-[#f93] text-[1.4rem] text-[#4a4a4a] font-semibold text-center">
            Công thức ({data?.stats?.totalRecipes && data.stats.totalRecipes})
          </div>
        </div>
        <ul className="">
          {data?.recipes?.length > 0 &&
            data.recipes.map((r, index) => (
              <RecipeProfile
                key={index}
                avatar={userinfo?.avatar && userinfo.avatar}
                name={userinfo?.fullName && userinfo.fullName}
                ingredients={handleNewIngredients(r.ingredients)}
                recipeName={r.name}
                src={r.image}
                link={`/recipes/${r._id}`}
                cookTime={
                  r.cookTime ? formatMinutesToHours(r.cookTime) : 0 + " phút"
                }
                serving={r.serving ? r.serving : 1}
              />
            ))}

          {/* <RecipeProfile
            avatar={
              "https://img-global.cpcdn.com/users/cef716253ce2460c/48x48cq50/avatar.webp"
            }
            name={"Manh’s Kitchen"}
            ingredients={ingreditents}
            src={
              "https://img-global.cpcdn.com/recipes/0523a78cf0690c8f/272x382f0.5_0.500481_1.0q50/ga-popcornremake-recipe-main-photo.webp"
            }
          />
          <RecipeProfile
            avatar={
              "https://img-global.cpcdn.com/users/cef716253ce2460c/48x48cq50/avatar.webp"
            }
            name={"Manh’s Kitchen"}
            ingredients={ingreditents}
            src={
              "https://img-global.cpcdn.com/recipes/0523a78cf0690c8f/272x382f0.5_0.500481_1.0q50/ga-popcornremake-recipe-main-photo.webp"
            }
          />
          <RecipeProfile
            avatar={
              "https://img-global.cpcdn.com/users/cef716253ce2460c/48x48cq50/avatar.webp"
            }
            name={"Manh’s Kitchen"}
            ingredients={ingreditents}
            src={
              "https://img-global.cpcdn.com/recipes/0523a78cf0690c8f/272x382f0.5_0.500481_1.0q50/ga-popcornremake-recipe-main-photo.webp"
            }
            last
          /> */}
        </ul>
        {/* <div className="my-[40px] flex items-center justify-center">
          <Link className="mx-[8px] font-semibold">1</Link>
          <Link className="mx-[8px]">2</Link>
          <Link className="mx-[8px]">3</Link>
          <Link className="mx-[8px]">4</Link>
          <div className="flex">
            <Link className="mx-[8px]">Tiếp theo</Link>
            <img src="/arrow_right.svg" alt="" />
          </div>
        </div> */}
      </div>
      }
    </>
  );
}

export default Profile;
