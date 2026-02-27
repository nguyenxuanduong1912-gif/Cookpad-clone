import { Link } from "react-router-dom";

function RecipeSame({ id, src, title, desc, tags, name, avatar }) {
  return (
    <div className="mb-[8px] border border-[#cececd] rounded-[8px] overflow-hidden break-inside-avoid">
      <a href={`/recipes/${id}`}>
        <img src={src} alt="" />
        <div className="p-[12px] flex flex-col gap-[8px]">
          <h2 className="leading-[20px] text-[1.8rem] font-semibold">
            {title}
          </h2>
          <div className="text-[1.4rem] text-[#606060]">
            <p>
              {tags.map((tag) => "#" + tag + " ")} <br></br>
              <span className="line-clamp-2">{desc && desc}</span>
            </p>
          </div>
          <div className="flex items-center gap-[8px]">
            <img
              src={avatar}
              alt=""
              className="w-[16px] h-[16px] object-contain rounded-[50%]"
            />
            <span className="text-[1.4rem] text-[#606060]">{name}</span>
          </div>
        </div>
      </a>
    </div>
  );
}

export default RecipeSame;
