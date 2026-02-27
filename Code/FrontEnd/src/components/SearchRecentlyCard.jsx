function SearchRecentlyCard({ text, minute, href, handleDelete }) {
  return (
    <a href={href}>
      <li className="flex items-center justify-between p-[8px] shadow-md">
        <div>
          <p className="text-[1.4rem] font-semibold">{text}</p>
          <p className="text-[#939290] text-[1.2rem]">{minute}</p>
        </div>
        <img
          src="close2.svg"
          alt=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDelete();
          }}
        />
      </li>
    </a>
  );
}

export default SearchRecentlyCard;
