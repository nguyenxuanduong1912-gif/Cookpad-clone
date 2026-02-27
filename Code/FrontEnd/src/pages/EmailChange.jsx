import Button from "../components/Button";

function EmailChange() {
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div className="p-[24px] w-[512px] mx-auto">
          <div className="flex flex-col gap-[16px] mb-[16px]">
            <p className="text-[#4a4a4a] font-semibold">
              Thay đổi địa chỉ email của bạn
            </p>
            <p className="text-[#4a4a4a] text-[1.4rem]">
              Nhập địa chỉ email mới. Một email xác nhận sẽ được gửi đến.
            </p>
          </div>
          <div className="w-full flex items-center border border-[#cececd] rounded-[4px] h-[40px] overflow-hidden bg-[#FFEBF0] hover:border-[#FFEBF0]">
            <div className="p-[8px]"></div>
            <input
              type="text"
              name=""
              id=""
              className="outline-none border-none flex-1 h-full text-gray-600 px-[4px] bg-transparent"
              placeholder="Địa chỉ email mới"
              defaultValue={"cook_114349030"}
            />
          </div>
          <div className="mb-[16px]">
            <p className="text-[1.3rem] mt-[4px] text-red-500">
              Địa chỉ email đã tồn tại
            </p>
            {/* <p className="text-[1.3rem] mt-[4px] text-red-500">
              Địa chỉ email không thể để trắng
            </p>
            <p className="text-[1.3rem] mt-[4px] text-red-500">
              Địa chỉ email không hợp lệ
            </p> */}
          </div>

          <p className="text-[1.4rem] text-[#4a4a4a] mb-[24px]">
            Địa chỉ email hiện tại:{" "}
            <span className="font-semibold">beoquangduong1@gmail.com</span>
          </p>
          <Button
            text={"Gửi"}
            px={"16px"}
            py={"8px"}
            color={"#f93"}
            textColor={"#ffff"}
            widthFull
            bold
          />
        </div>
      </div>
    </>
  );
}

export default EmailChange;
