function RecipeCard({ src, text, description, href }) {
  return (
    <>
      <a href={href}>
        <div className="col-span-1">
          <div className="rounded-[6px] overflow-hidden">
            <div className="mb-[16px]">
              <img
                src={src}
                alt=""
                className="h-[198px] w-full object-cover rounded-[6px]"
              />
            </div>
            <p className="mb-[4px] font-semibold">{text}</p>
            <p className="text-[#939290] text-[1.2rem]">{description}</p>
          </div>
        </div>
      </a>
    </>
  );
}

export default RecipeCard;
