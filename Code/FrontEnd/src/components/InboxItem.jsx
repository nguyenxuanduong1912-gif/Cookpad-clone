import { Link } from "react-router-dom";

function InboxItem({ message, ago, admin }) {
  return (
    <>
      <li className="px-[16px] py-[8px] w-full border-t bg-[#F0F0F0]">
        <div className="mr-[16px] flex w-full">
          <img
            src={`${
              admin
                ? "https://img-global.cpcdn.com/users/afd7a5c6bbadd452/90x90cq50/avatar.webp"
                : "https://global-web-assets.cpcdn.com/assets/logo_circle-d106f02123de882fffdd2c06593eb2fd33f0ddf20418dd75ed72225bdb0e0ff7.png"
            }`}
            alt=""
            className="mr-[10px] w-[45px] h-[45px] rounded-[50%] object-contain"
          />
          <div>
            <Link>
              {admin && (
                <>
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[1.4rem] text-[#4a4a4a] font-semibold block">
                      Cookpad dễ thương
                    </span>
                    <div className="text-[1.2rem] text-white bg-[#939290] px-[4px] py-[2px] rounded-[6px]">
                      Admin
                    </div>
                  </div>
                  <span className="text-[1.4rem] text-[#4a4a4a]">
                    Đã nhắn tin cho bạn
                  </span>
                </>
              )}
              <span className="text-[1.4rem] text-[#4a4a4a] block line-clamp-2">
                {message}
              </span>
              <span className="mt-[8px] text-[1.2rem] text-[#939290]">
                {ago}
              </span>
            </Link>
          </div>
        </div>

        <div></div>
      </li>
    </>
  );
}

export default InboxItem;
