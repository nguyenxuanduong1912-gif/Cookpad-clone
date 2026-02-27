import { Link } from "react-router-dom";

function Item({ src, text, quality, link, active, onClick }) {
  return (
    <Link to={link} className="">
      <li
        className="p-[8px] flex gap-[8px] hover:bg-[#f8f6f2] rounded-[6px]"
        onClick={onClick}
      >
        <div className="h-[48px] w-[48px] bg-[#ecebe9] rounded-md flex items-center justify-center">
          <img src={src} alt="" className="" />
        </div>

        <div className="flex flex-col">
          <span className={`text-[1.8rem] ${active && "text-[#f93]"} `}>
            {text}
          </span>
          <span className="text-[1.2rem]">{quality + " món"}</span>
        </div>
      </li>
    </Link>
  );
}

export default Item;
