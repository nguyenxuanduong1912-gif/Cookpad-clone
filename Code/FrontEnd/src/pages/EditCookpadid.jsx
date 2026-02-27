import Button from "../components/Button";

function EditCookpadid() {
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div className="p-[24px] w-[448px] mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-[#4a4a4a] font-semibold mb-[16px]">
              Thay đổi ID Cookpad
            </h1>
            <img
              src="https://img-global.cpcdn.com/users/bf33ae32b9221dd0/216x216cq50/avatar.webp"
              alt=""
              className="w-[96px] h-[96[px] object-contain rounded-[50%] mb-[8px]"
            />
            <p className="font-semibold my-[16px]">Ba dao</p>
          </div>
          <div>
            <div className="mb-[8px] w-full flex items-center border border-[#cececd] rounded-[8px] h-[40px] overflow-hidden">
              <p className="w-[30px] h-full flex items-center justify-center text-gray-500">
                @
              </p>
              <input
                type="text"
                name=""
                id=""
                className="outline-none border-none flex-1 h-full text-gray-600 px-[4px]"
                placeholder="bepnhacotam"
                defaultValue={"cook_114349030"}
              />
            </div>
            {/* <p className="text-[#fe463a] text-[1.4rem]">
              Id cookpad đã được sử dụng
            </p> */}
            {/* <p className="text-[#fe463a] text-[1.4rem]">Id cookpad quá ngắn</p> */}
            {/* <p className="text-[#fe463a] text-[1.4rem]">Id cookpad quá dài</p> */}
            {/* <p className="text-[#fe463a] text-[1.4rem]">
              Id cookpad đã được sử dụng
            </p> */}
            {/* <p className="text-[#fe463a] text-[1.4rem]">
              ID Cookpad nên có 1 chữ cái. Bạn có thể dùng chữ số và dấu gạch
              ngang dưới _
            </p> */}
            <div className="my-[16px]">
              <p className="text-[1.4rem] text-[#939290]">
                ID Cookpad của bạn có thể:
                <br />- Dài từ 4 – 20 ký tự
                <br />- Bao gồm chữ cái, chữ số, hay dấu _
                <br />- Không có khoảng trống nào
              </p>
            </div>

            <div className="mt-[8px]">
              <Button
                text={"Xác nhận ID Cookpad"}
                px={"16px"}
                py={"8px"}
                color={"#4a4a4a"}
                textColor={"#ffff"}
                bold
                widthFull
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditCookpadid;
