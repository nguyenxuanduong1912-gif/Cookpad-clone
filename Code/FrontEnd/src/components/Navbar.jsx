import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import LiComponent from "./Li";
import Item from "./Item";
import { userContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
function Navbar({
  isOpen,
  openFunction,
  closeFunction,
  data,
  setData,
  inputValue,
  setInputValue,
  handleSubmitFormSearch,
  setOpenLogin,
}) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const [active, setActive] = useState("search");
  const { user, setUser } = useContext(userContext);
  return (
    <div
      className={`${
        isOpen ? "col-span-2" : "w-[64px] flex-shrink-0"
      } bg-white text-[#606060] text-[1.8rem]`}
    >
      <div
        className={`fixed z-50 h-screen ${isOpen ? "w-[250px]" : " w-auto"}`}
      >
        <div className="mt-[0.8rem] pt-[2rem]">
          <div
            className={`flex ${
              !isOpen && "flex-col-reverse gap-[25px] justify-start"
            } ml-[1.6rem] mb-[2.8rem] mr-[2.4rem] justify-between items-center`}
          >
            <Link to={"/"}>
              <div
                className={`flex ${
                  !isOpen && "flex-col"
                } gap-[0.4rem] items-center`}
              >
                <img
                  src="/logo.png"
                  alt=""
                  className={`${
                    isOpen ? "w-[3.2rem] h-[3.2rem]" : "w-[2.8rem] h-[2.8rem]"
                  } object-contain`}
                />
                <img
                  src="/logo_text.png"
                  alt=""
                  className={`${
                    isOpen ? "w-[8rem] h-[3.2rem]" : "w-[32px] h-[12px]"
                  } object-contain`}
                />
              </div>
            </Link>

            {isOpen ? (
              <MdOutlineKeyboardDoubleArrowLeft
                size={23}
                className="cursor-pointer"
                onClick={closeFunction}
              />
            ) : (
              <MdOutlineKeyboardDoubleArrowRight
                size={23}
                className="cursor-pointer"
                onClick={openFunction}
              />
            )}
          </div>

          <ul className="flex flex-col gap-[2.8rem]">
            <LiComponent
              src={"/search.svg"}
              text={"Tìm Kiếm"}
              href={"/"}
              active={active === "search"}
              onClick={() => setActive("search")}
              isOpen={isOpen}
            />

            <LiComponent
              src={"/challenge.svg"}
              text={"Danh mục dinh dưỡng"}
              href={"/nutrition"}
              active={active === "premium"}
              onClick={() => setActive("premium")}
              isOpen={isOpen}
            />
            <LiComponent
              src={"/challenge.svg"}
              text={"Danh mục món ăn"}
              href={"/categories"}
              active={active === "challenge"}
              onClick={() => setActive("challenge")}
              isOpen={isOpen}
            />
            {/* <LiComponent
              src={"/bell.svg"}
              text={"Tương Tác"}
              dot={true}
              href={"/"}
              active={active === "Interact"}
              onClick={() => setActive("Interact")}
              isOpen={isOpen}
            /> */}
            {user && (
              <LiComponent
                src={"/statistical.svg"}
                text={"Thống Kê Bếp"}
                active={active === "statistical"}
                onClick={() => setActive("statistical")}
                isOpen={isOpen}
                href={"/stactistical"}
              />
            )}
          </ul>

          <div className="pt-[28px] mb-[16px] flex flex-col">
            <LiComponent
              src={"/collection.svg"}
              text={"Kho món ngon của bạn"}
              className={"mb-[16px]"}
              isOpen={isOpen}
              noLink
            />
            {!user && isOpen ? (
              <span className="mx-[20px] text-[1.3rem]">
                Để bắt đầu tạo kho lưu trữ món ngon của riêng bạn,{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={() => setOpenLogin(true)}
                >
                  vui lòng đăng ký hoặc đăng nhập.
                </span>
              </span>
            ) : (
              isOpen && (
                <>
                  <form
                    action=""
                    className="mx-[20px] mb-[8px]"
                    onSubmit={handleSubmitFormSearch}
                  >
                    <div className="flex text-[1.6rem] bg-[#f8f6f2] h-[48px] items-center px-[8px] rounded">
                      <img src="/search.svg" alt="" className="mr-[8px]" />
                      <input
                        type="text"
                        placeholder="Tìm trong kho món ngon của bạn"
                        name="query"
                        className="border-none outline-none caret-[#f93] w-full bg-transparent"
                        value={inputValue}
                        onInput={(e) => {
                          setInputValue(e.target.value);
                        }}
                      />
                    </div>
                  </form>

                  <div className="px-[20px] pb-[10px] h-[190px] overflow-y-auto">
                    <ul>
                      <Item
                        src={"/collection.svg"}
                        text={"Tất Cả"}
                        quality={data.all.length}
                        link={"/me/library"}
                        active={!source && location.pathname === "/me/library"}
                      />
                      <Item
                        src={"/save.svg"}
                        text={"Đã Lựu"}
                        quality={data.saved.length}
                        link={"/me/library?source=saved"}
                        active={source === "saved"}
                      />
                      <Item
                        src={"/check.svg"}
                        text={"Đã Nấu"}
                        quality={data.cooked.length}
                        link={"/me/library?source=cooked"}
                        active={source === "cooked"}
                      />
                      <Item
                        src={"/user.svg"}
                        text={"Món Của Tôi"}
                        quality={data.authored.length}
                        link={"/me/library?source=authored"}
                        active={source === "authored"}
                      />
                      <Item
                        src={"/globe.svg"}
                        text={"Đã Lên Sóng"}
                        quality={data.published.length}
                        link={"/me/library?source=published"}
                        active={source === "published"}
                      />
                      <Item
                        src={"/lock.svg"}
                        text={"Món Nháp"}
                        quality={data.draft.length}
                        link={"/me/library?source=drafts"}
                        active={source === "drafts"}
                      />
                    </ul>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
