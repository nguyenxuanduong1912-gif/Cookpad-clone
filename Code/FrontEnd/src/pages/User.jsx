import Friend from "../components/Friend";

function User() {
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div className="py-[16px]">
          <div className="flex items-center text-[2.8rem] text-[#4a4a4a]">
            <span>Tác giả tên</span>
            <h1 className="font-semibold">"Chilly"</h1>
            <span className="text-[2rem] text-[#939290]">(8)</span>
          </div>
        </div>
        <div className="mb-[16px] w-1/2 flex items-center border border-[#cececd] rounded-[8px] h-[40px] overflow-hidden">
          <div className="flex-shrink-0 w-[30px] h-full flex items-center justify-center">
            <img src="/user.svg" alt="" className="w-[20px] h-[20px]" />
          </div>
          <input
            type="text"
            name=""
            id=""
            className="outline-none border-none flex-1 h-full text-gray-600 px-[4px]"
            placeholder="Tìm bạn bếp"
          />
        </div>

        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
        <Friend
          avatar={
            "https://img-global.cpcdn.com/users/ae59ce1b803b3969/128x128cq50/avatar.webp"
          }
          name={"chillylinh"}
          idCookpad={"@chillylinh"}
          amount={23}
          border
        />
      </div>
    </>
  );
}

export default User;
