import { Link } from "react-router-dom";
import Button from "../components/Button";
function EditProfile() {
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div className="py-[16px]">
          <div className="w-[112px] h-[112px] object-contain rounded-[50%] overflow-hidden relative">
            <img
              src="https://img-global.cpcdn.com/users/bf33ae32b9221dd0/200x200cq80/photo.webp"
              alt=""
              className="w-full h-full object-contain"
            />
            <div className="w-full h-full absolute top-0 flex items-center justify-center">
              <div className="flex items-center cursor-pointer px-[8px] py-[4px] bg-black/60 rounded-[5px] bottom-[5px] right-[5px]">
                <label htmlFor="fileUpload">
                  <img
                    src="/camera2.svg"
                    alt=""
                    className="pr-[8px] mr-[8px] border-r"
                  />
                </label>
                <img src="/bin2.svg" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-[24px] pb-[16px]">
          <label htmlFor="name">
            <p className="text-[#4a4a4a] mb-[8px] font-semibold">Tên</p>
            <input
              type="text"
              name="name"
              id="name"
              className="outline-none border-none w-full"
              placeholder="Tên bạn (hiển thị công khai)"
            />
          </label>
        </div>
        <div className="pt-[24px] pb-[16px] border-t-[#cecdcd] border-t-[2px]">
          <label htmlFor="">
            <p className="text-[#4a4a4a] mb-[8px] font-semibold">ID Cookpad</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">@cook_114349030</span>
              <Link to={"/editCookpadid"} className="text-[#f93]">
                Sửa
              </Link>
            </div>
          </label>
        </div>
        <div className="pt-[24px] pb-[16px] border-t-[#cecdcd] border-t-[2px]">
          <label htmlFor="">
            <p className="text-[#4a4a4a] mb-[8px] font-semibold">Email</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">beoquangduong1@gmail.com</span>
              <Link className="text-[#f93]">Đổi</Link>
            </div>
          </label>
        </div>

        <div className="pt-[24px] pb-[16px] border-t-[#cecdcd] border-t-[2px]">
          <label htmlFor="from">
            <p className="text-[#4a4a4a] mb-[8px] font-semibold">Đến từ</p>
            <input
              type="text"
              name="from"
              id="from"
              className="outline-none border-none w-full"
              placeholder="Đến từ...."
            />
          </label>
        </div>
        <div className="pt-[24px] pb-[16px] border-t-[#cecdcd] border-t-[2px]">
          <label htmlFor="from">
            <p className="text-[#4a4a4a] mb-[8px] font-semibold">
              Tự giới thiệu về bạn và niềm vui nấu nướng của bạn
            </p>
            <input
              type="text"
              name="from"
              id="from"
              className="outline-none border-none w-full"
              placeholder="Tiểu sử"
            />
          </label>
        </div>

        <div className="flex items-center gap-[8px]">
          <Button
            text={"Cập nhật"}
            px={"16px"}
            py={"8px"}
            textColor={"#ffff"}
            color={"#4a4a4a"}
            flex1
          />
          <Button
            text={"Bỏ qua"}
            px={"16px"}
            py={"8px"}
            textColor={"#606060"}
            color={"#ecebe9"}
            flex1
          />
        </div>
      </div>
    </>
  );
}

export default EditProfile;
