import { Link } from "react-router-dom";

function RecipeSame({ id, src, title, desc, tags, name, avatar }) {
  return (
    <div className="inline-block w-full mb-[12px] border border-[#cececd] rounded-[8px] overflow-hidden break-inside-avoid bg-white hover:shadow-md transition-shadow">
      <a href={`/recipes/${id}`} className="block">
        <img 
          src={src} 
          alt={title} 
          className="w-full h-auto object-cover"
        />
        <div className="p-[12px] flex flex-col gap-[8px]">
          <h2 className="leading-[20px] text-[1.6rem] font-semibold text-[#4A4A4A] line-clamp-2">
            {title}
          </h2>
          <div className="text-[1.3rem] text-[#606060]">
            <p className="mb-[4px] font-medium">
              {tags.map((tag) => "#" + tag + " ")}
            </p>
            <p className="line-clamp-2 leading-relaxed">
              {desc}
            </p>
          </div>
          <div className="flex items-center gap-[8px] mt-[4px]">
            <img
              src={avatar}
              alt={name}
              className="w-[20px] h-[20px] object-cover rounded-full border border-gray-100"
            />
            <span className="text-[1.2rem] text-[#606060] font-medium truncate">
              {name}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}

export default RecipeSame;