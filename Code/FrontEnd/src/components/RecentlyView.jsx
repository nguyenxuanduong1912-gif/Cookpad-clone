import { Link } from "react-router-dom";

function RecentlyView({ src, avatar, name, decription, href }) {
  return (
    <Link to={href}>
      <div className="col-span-1 rounded-[8px] overflow-hidden border h-full">
        <div>
          <img
            src={
              src
                ? src
                : "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png"
            }
            alt=""
            className="rounded-tr-[8px] rounded-tl-[8px] h-[129px] w-full object-cover"
          />
        </div>
        <div>
          <div className="p-[8px]">
            <div className="flex items-center gap-[4px]">
              <img
                src={avatar}
                alt=""
                className="w-[20px] h-[20px] rounded-[50%]"
              />
              <span className="text-[1.2rem]">{name}</span>
            </div>
            <span className="mt-[4px] block text-[1.4rem] font-semibold">
              {decription}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RecentlyView;
