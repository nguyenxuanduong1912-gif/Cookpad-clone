import { Link } from "react-router-dom";
import Button from "../components/Button";

function Report() {
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div className="mt-[8px] mb-[40px] w-full">
          <div className="flex gap-[16px] w-full">
            <img
              src="https://global-web-assets.cpcdn.com/assets/blank-fd7d144d8ce163db654e5a02c40b08a2775adb7897d16e4062681dc7e1b2800f.png"
              alt=""
              className="w-[144px] h-[144px] object-cover rounded-[6px]"
            />
            <div className="ml-[8px] flex flex-col gap-[8px]">
              <p className="text-[#4a4a4a] text-[2.2rem] font-semibold">
                Cơm chiên trứng siêu nhanh cho bữa sáng
              </p>
              <span className="text-[1.2rem] text-[#939290]">
                vào 9 tháng 10 năm 2025
              </span>
            </div>
          </div>
          <div className="my-[16px]">
            <Link to={"/recipes/123"}>
              <Button
                text={"Xem công thức này"}
                px={"16px"}
                py={"8px"}
                textColor={"#4a4a4a"}
                color={"#ecebe9"}
                widthFull
                bold
              />
            </Link>
          </div>
          <div className="my-[16px]">
            <Button
              text={"Chỉnh sửa công thức"}
              px={"16px"}
              py={"8px"}
              textColor={"#4a4a4a"}
              color={"#ffff"}
              widthFull
              bold
            />
          </div>
        </div>

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
              <span className="text-[1.4rem] text-[#676767]">Lượt lưu</span>

              <p className="text-[#f47e2e]">1</p>
            </div>
            <div className="p-[8px] bg-[#f8f6f2] rounded-[8px]">
              <img
                src="/print.svg"
                alt=""
                className="w-[16px] h-[16px] inline-block mr-[5px]"
              />
              <span className="text-[1.4rem] text-[#676767]">Lượt in</span>

              <p className="text-[#f47e2e]">0</p>
            </div>
            <div className="p-[8px] bg-[#f8f6f2] rounded-[8px]">
              <img
                src="/camera.svg"
                alt=""
                className="w-[16px] h-[16px] inline-block mr-[5px]"
              />
              <span className="text-[1.4rem] text-[#676767]">Lượt nấu</span>

              <p className="text-[#f47e2e]">0</p>
            </div>
            <div className="p-[8px] bg-[#f8f6f2] rounded-[8px]">
              <img
                src="/view.svg"
                alt=""
                className="w-[16px] h-[16px] inline-block mr-[5px]"
              />
              <span className="text-[1.4rem] text-[#676767]">Lượt xem</span>

              <p className="text-[#f47e2e]">29</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
