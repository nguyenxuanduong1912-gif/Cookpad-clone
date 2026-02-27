function TrendingCard({ text, src, href }) {
  return (
    <div className="col-span-1 h-[94px] overflow-hidden relative">
      <a href={href}>
        <span className="text-[#fff] font-semibold absolute left-[8px] bottom-[8px]">
          {text}
        </span>
        <img
          src={src}
          alt=""
          className="rounded-[8px] w-full h-full object-cover brightness-60"
        />
      </a>
    </div>
  );
}

export default TrendingCard;
