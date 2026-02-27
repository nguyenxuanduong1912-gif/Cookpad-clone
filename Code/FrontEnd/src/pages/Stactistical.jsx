import { Link } from "react-router-dom";
import RecipeChart from "./RecipeChart";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/UserContext";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
function Stactistical() {
  const { user, setUser } = useContext(userContext);
  const [data, setData] = useState([]);
  const [chartData, setchartData] = useState([]);
  const [cookingNumber, setCookingNumber] = useState(0);
  const [state, setState] = useState(false);
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/recipes/${user.id}/statistics`);
        const res2 = await axiosClient.get(`recipes/${user.id}/activityChart`);
        const res3 = await axiosClient.get(
          `recipes/${user.id}/activityChartCooking`
        );
        if (state) {
          setchartData(res2.data);
        } else {
          setchartData(res3.data);
        }
        setData(res.data);
      } catch (error) {
        toast(error.response);
      }
    };
    fetchData();
  }, [user, state]);
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div>
          <div className="p-[16px]">
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[50%] overflow-hidden border-[4px] border-gray-300">
                <Link
                  to={`/profile/${user?.id}`}
                  className="flex items-center justify-center"
                >
                  <img
                    src={user?.avatar && user.avatar}
                    alt=""
                    className="w-[90%] h-[90%] rounded-[50%] object-contain"
                  />
                </Link>
              </div>
              <div className="ml-[16px]">
                <h1 className="text-[1.8rem] text-[#4a4a4a] font-semibold">
                  {user?.fullName && user.fullName}
                </h1>
                {/* <p className="text-[1.2rem] text-[#939290]">@cook_114349030</p> */}
                <p className="text-[1.2rem] text-[#939290]">
                  {data?.totalRecipes && data.totalRecipes + " Món đã lên sóng"}
                </p>
              </div>
            </div>
          </div>
          <div className="py-[16px]">
            <div className="text-[2rem] text-[#4a4a4a] font-semibold mb-[8px]">
              Nổi bật
            </div>
            <p className="text-[1.2rem] text-[#676767]">90 ngày qua</p>

            <div className="mt-[16px] mb-[8px]">
              <ul className="flex items-center">
                <li
                  className={`py-[8px] flex-1 ${
                    !state && "border-b-[#f93] border-b-[2px]"
                  } cursor-pointer text-center text-[1.4rem] font-semibold`}
                  onClick={() => setState(false)}
                >
                  Đã nấu
                </li>
                <li
                  className={`py-[8px] flex-1 ${
                    state && "border-b-[#f93] border-b-[2px]"
                  } cursor-pointer text-center text-[1.4rem] font-semibold`}
                  onClick={() => setState(true)}
                >
                  Đã xem
                </li>
              </ul>

              <div className="py-[32px] justify-center gap-[4px] text-gray-700 flex items-center">
                <span className="text-[2.4rem] font-semibold">
                  {chartData?.data?.length > 0
                    ? chartData.data.reduce((acc, r) => acc + r.count, 0)
                    : 0}
                </span>
                <span>
                  Người {state ? " xem" : " nấu"} theo công thức của bạn
                </span>
              </div>
              <div className="mb-[8px]">
                <div className="px-[12px] py-[6px] text-white bg-[#4a4a4a] w-fit rounded-full text-[1.2rem] cursor-pointer">
                  90 ngày qua
                </div>
              </div>

              <RecipeChart data={chartData.data} />

              <div className="py-[16px]">
                <p className="text-[2rem] text-[#4a4a4a] font-semibold mb-[8px]">
                  Hoạt động công thức
                </p>
                <p className="mb-[16px] text-[1.2rem] text-[#676767]">
                  Lịch sử đầy đủ
                </p>
                <div className="grid grid-cols-2 gap-[8px]">
                  <div className="p-[8px] bg-[#f8f6f2] rounded-[8px]">
                    <img
                      src="/unsave.svg"
                      alt=""
                      className="w-[16px] h-[16px] inline-block mr-[5px]"
                    />
                    <span className="text-[1.4rem] text-[#676767]">
                      Lượt lưu
                    </span>

                    <p className="text-[#f47e2e]">
                      {" "}
                      {data?.summary?.saves ? data.summary.saves : 0}
                    </p>
                  </div>
                  <div className="p-[8px] bg-[#f8f6f2] rounded-[8px]">
                    <img
                      src="/print.svg"
                      alt=""
                      className="w-[16px] h-[16px] inline-block mr-[5px]"
                    />
                    <span className="text-[1.4rem] text-[#676767]">
                      Lượt in
                    </span>

                    <p className="text-[#f47e2e]">
                      {" "}
                      {data?.summary?.prints ? data.summary.prints : 0}
                    </p>
                  </div>
                  <div className="p-[8px] bg-[#f8f6f2] rounded-[8px]">
                    <img
                      src="/camera.svg"
                      alt=""
                      className="w-[16px] h-[16px] inline-block mr-[5px]"
                    />
                    <span className="text-[1.4rem] text-[#676767]">
                      Món đã lên sóng
                    </span>

                    <p className="text-[#f47e2e]">
                      {data?.totalRecipes ? data.totalRecipes : 0}
                    </p>
                  </div>
                  <div className="p-[8px] bg-[#f8f6f2] rounded-[8px]">
                    <img
                      src="/view.svg"
                      alt=""
                      className="w-[16px] h-[16px] inline-block mr-[5px]"
                    />
                    <span className="text-[1.4rem] text-[#676767]">
                      Lượt {state ? " xem" : " nấu"}
                    </span>

                    <p className="text-[#f47e2e]">
                      {" "}
                      {chartData?.data?.length > 0
                        ? chartData.data.reduce((acc, r) => acc + r.count, 0)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Stactistical;
