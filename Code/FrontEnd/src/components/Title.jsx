function Title({ text, icon, arrow, time, handleOnCLick }) {
  return (
    <div className="flex items-center justify-between mb-[16px] text-[#606060]">
      <h1
        className={`text-[1.8rem] font-semibold ${
          icon && "flex items-center gap-[4px]"
        }`}
      >
        {icon ? (
          <>
            <img src={icon} alt="" />
            {text}
          </>
        ) : (
          text
        )}
      </h1>

      <div className="flex items-center gap-[12px]">
        {time ? <span className="text-[1.2rem]">{time}</span> : null}

        {arrow && (
          <img
            src={arrow}
            alt=""
            className="cursor-pointer"
            onClick={handleOnCLick}
          />
        )}
      </div>
    </div>
  );
}

export default Title;
