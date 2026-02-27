import Button from "../components/Button";
import { Link } from "react-router-dom";
function EmailChangeRequest() {
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div className="p-[24px] w-[512px] mx-auto">
          <div className="flex flex-col gap-[16px] mb-[16px]">
            <p className="text-[#4a4a4a] font-semibold">
              Xác minh địa chỉ email mới
            </p>
            <p className="text-[1.3rem] text-[#4a4a4a] mb-[24px]">
              Nhập mã xác thực đã được gửi đến:
              <span className="font-semibold">beoquangduong1@gmail.com</span>
            </p>
          </div>
          <div className="w-full flex items-center border border-[#cececd] rounded-[5px] h-[40px] overflow-hidden bg-[#FFEBF0] hover:border-[#FFEBF0]">
            <div className="p-[8px]"></div>
            <input
              type="text"
              name=""
              id=""
              maxLength={6}
              className="outline-none border-none flex-1 h-full text-gray-600 px-[4px] bg-transparent placeholder:text-red-600"
              placeholder="Mã xác minh"
            />
          </div>
          <div className="mb-[16px]">
            {/* <p className="text-[1.3rem] mt-[4px] text-red-600">
              Code given không hợp lệ
            </p> */}
            {/* <p className="text-[1.3rem] mt-[4px] text-red-500">
              Code given không thể để trắng
            </p> */}
          </div>

          <Button
            text={"Tiếp"}
            px={"16px"}
            py={"8px"}
            color={"#f93"}
            textColor={"#ffff"}
            widthFull
            bold
          />
          <Link className="text-[#939290] text-[1.3rem] mt-[24px] block underline">
            Tôi không nhận được mã xác minh
          </Link>
        </div>
      </div>
    </>
  );
}

export default EmailChangeRequest;
