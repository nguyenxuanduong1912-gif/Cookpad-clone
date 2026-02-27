import { Link } from "react-router-dom";
import Button from "./Button";

function Friend({ avatar, name, idCookpad, amount, border }) {
  return (
    <>
      <div
        className={`px-[16px] py-[8px] ${
          border && "border-t border-t-[#cececd]"
        }`}
      >
        <div className="flex">
          <div className="mr-[8px]">
            <Link>
              <img
                src={avatar}
                alt=""
                className="w-[40px] h-[40px] object-contain rounded-[50%]"
              />
            </Link>
          </div>
          <div className="flex-1">
            <Link className="text-[1.4rem] text-[#4a4a4a] font-semibold w-full block">
              {name}
            </Link>
            <span className="text-[1.4rem] text-[#939290]">{idCookpad}</span>
            <div className="flex items-center gap-[4px]">
              <img src="/recipe.svg" alt="" className="w-[16px] h-[16px]" />
              <span className="text-[1.2rem] text-[#939290]">{amount} Món</span>
            </div>
          </div>
          <div>
            <Button
              text={"Kết bạn bếp"}
              px={"16px"}
              py={"1px"}
              textColor={"#ffff"}
              color={"#4a4a4a"}
            />
            {/* <Button
              text={"Bạn bếp"}
              px={"16px"}
              py={"1px"}
              textColor={"#606060"}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Friend;
