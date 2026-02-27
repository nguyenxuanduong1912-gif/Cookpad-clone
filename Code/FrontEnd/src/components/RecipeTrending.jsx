import { Link } from "react-router-dom";

function RecipeTrending({ keyword, suggest, src, link }) {
  return (
    <div className="col-span-1 rounded-[8px] overflow-hidden shadow">
      <a href={link}>
        <div>
          <img src={src} alt="" className="" />
          <div className="p-[8px] flex items-center gap-[4px]">
            <img src="search.svg" alt="" className="w-[20px] h-[20px]" />
            <div className="line-clamp-2 text-[1.2rem]">
              <span className="font-semibold">{keyword}</span>
              <span> </span> {suggest}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default RecipeTrending;
