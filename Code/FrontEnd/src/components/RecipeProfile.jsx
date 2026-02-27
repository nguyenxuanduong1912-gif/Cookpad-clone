import { Link } from "react-router-dom";
function RecipeProfile({
  avatar,
  name,
  ingredients,
  src,
  last,
  recipeName,
  link,
  cookTime,
  serving,
}) {
  return (
    <li
      className={`border-t border-t-[#cececd] py-[16px] ${
        last && "border-b border-b-[#cececd]"
      }`}
    >
      <div className="flex">
        <Link to={link} className="w-full cursor-pointer">
          <div className="mb-[8px] flex items-center justify-between w-full">
            <div className="flex items-center gap-[5px]">
              <img
                src={avatar}
                alt=""
                className="w-[24px] h-[24px] object-contain rounded-[50%]"
              />
              <span className="text-[1.4rem] text-[#606060]">{name}</span>
            </div>
          </div>
          <h2 className="text-[2.4rem] mb-[4px] font-semibold">{recipeName}</h2>
          <div className="flex flex-wrap text-[#4a4a4a] text-[1.5rem] mb-[16px]">
            {ingredients}
          </div>

          <div className="flex items-center gap-[15px]">
            <div className="flex items-center gap-[4px]">
              <img src="/clock.svg" alt="" className="w-[16px] h-[16px]" />
              <span className="text-[#4a4a4a] text-[1.4rem]">{cookTime}</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <img src="/user.svg" alt="" className="w-[16px] h-[16px]" />
              <span className="text-[#4a4a4a] text-[1.4rem]">
                {serving} người
              </span>
            </div>
          </div>
        </Link>
        <Link to={link} className="w-[20%] flex-shrink-0 block cursor-pointer">
          <img src={src} alt="" className="h-[182px] object-cover" />
        </Link>
      </div>
    </li>
  );
}

export default RecipeProfile;
