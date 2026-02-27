function Button({
  text,
  color,
  px,
  py,
  icon,
  textColor,
  borderColor,
  widthFull,
  bold,
  pre,
  setData,
  imgSrc,
  flex1,
  setDraft,
  submit,
  loading,
  ...rest
}) {
  return (
    <button
      type={submit ? "submit" : "button"}
      className={`flex items-center relative flex-shrink-0 justify-center ${
        flex1 && "flex-1"
      } ${pre && "ml-[8px]"} ${
        bold && "font-semibold"
      } bg-[${color}] px-[${px}] py-[${py}] gap-[7px] rounded-[8px] border-[1px] border-[${borderColor}] text-[${textColor}] hover:bg-opacity-90 leading-[24px] ${
        widthFull && "w-full"
      } ${loading && "opacity-60"}`}
      onClick={() => {
        setData && setData((pre) => [...pre, { image: imgSrc }]);
        setDraft && setDraft(true);
      }}
      {...rest}
      disabled={loading}
    >
      {loading && (
        <div className="w-[25px] h-[25px] border-[4px] rounded-[50%] border-t-red-500 animate-rotate"></div>
      )}
      {pre && (
        <img
          src="/premium2.svg"
          alt=""
          className="absolute top-[-14px] left-[-12px] z-10 bg-white"
        />
      )}
      {!loading && (
        <div className="flex items-center gap-[5px]">
          {icon ? (
            <>
              {" "}
              {icon} {text}
            </>
          ) : (
            text
          )}
        </div>
      )}
    </button>
  );
}

export default Button;
