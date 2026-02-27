import { Link } from "react-router-dom";
function LiComponent({
  src,
  text,
  href,
  className,
  active,
  onClick,
  dot,
  isOpen,
  noLink
}) {
  return (
    <li
      className={`w-full ${
        dot &&
        'relative before:content-[""] before:w-[6px] before:h-[6px] before:rounded-[50%] before:bg-red-500 before:left-[38px] before:top-[2px] before:absolute '
      }`}
      onClick={onClick}
    >
      <Link
        onClick={(e) => {
          if(noLink){
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        to={href}
        className={`${noLink ? 'cursor-text' : ''} flex items-center gap-[1.2rem] px-[2rem] w-full ${className}`}
      >
        <img src={src} alt="" className="" />
        {isOpen && <span className={`${active && "text-[#f93]"}`}>{text}</span>}
      </Link>
    </li>
  );
}

export default LiComponent;
