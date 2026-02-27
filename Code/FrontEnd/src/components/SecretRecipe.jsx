import { Link } from "react-router-dom";

function SecretRecipe({
  text,
  avatar,
  name,
  src,
  onClick,
  recipeId,
  fuc,
  handleModal,
}) {
  return (
    <>
      <div className="flex gap-[10px] text-[#4A4A4A] border">
        <div className="flex-1 p-[8px]">
          <Link
            onClick={() => {
              onClick(fuc, recipeId, "url", src);
              onClick(fuc, recipeId, "text", text);
              handleModal(false);
            }}
          >
            <span className="mb-[5px] block font-semibold">{text}</span>
          </Link>
          <Link className="flex gap-[5px]">
            <img
              src={avatar}
              alt=""
              className="w-[20px] h-[20px] rounded-[50%]"
            />
            <span className="text-[1.2rem]">{name}</span>
          </Link>
        </div>
        <Link className="">
          <img src={src} alt="" className="w-[64px] h-[64px] object-cover" />
        </Link>
      </div>
    </>
  );
}

export default SecretRecipe;
