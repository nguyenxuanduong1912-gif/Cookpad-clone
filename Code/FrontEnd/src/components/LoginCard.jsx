import { Link } from "react-router-dom";

function LoginCard({ logo, text, color, margin, ...rest }) {
  return (
    <Link>
      <div
        className={`flex items-center w-full px-[16px] py-[12px] rounded-[8px] ${
          color && "bg-black"
        } border ${margin && "mb-[16px]"}`}
        {...rest}
      >
        <img src={logo} alt="" className="w-[24px] h-[24px] object-contain" />
        <p
          className={`flex-1 text-center ${
            color ? "text-[#ffff]" : "text-black"
          }`}
        >
          {text}
        </p>
      </div>
    </Link>
  );
}

export default LoginCard;
