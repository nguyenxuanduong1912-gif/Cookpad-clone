import { Link } from "react-router-dom";
import InboxItem from "../components/InboxItem";

function Inbox() {
  return (
    <>
      <div className="w-[680px] mx-auto">
        <div className="px-[16px] w-full">
          <h1 className="my-[16px] text-[3.2rem] text-[#4a4a4a] font-semibold">
            Tương tác
          </h1>

          <ul className="w-full">
            <InboxItem
              message={
                "📣🔍 Chào bạn ba dao! Trân trọng chào đón bạn đến với Cookpad!!🤗🎊 Cookpad là cộng đồng nấu ăn với hệ thống lưu trữ công thức lớn nhất Việt Nam 🇻🇳 được chia sẻ bởi các chủ bếp ở khắp mọi nơi, với vô cùng nhiều công thức được tuyển chọn chất lượng cao."
              }
              ago={"12 ngày trước"}
              admin
            />

            <InboxItem
              message={
                "Chúc mừng! Một người dùng đã tìm thấy công thức đầu tiên bạn đăng khi tìm kiếm 'trứng'."
              }
              ago={"12 ngày trước"}
            />
            <InboxItem
              message={
                "🎉 Cơm chiên trứng siêu nhanh cho bữa sáng đã được xem 10 lần!"
              }
              ago={"12 ngày trước"}
            />
            <InboxItem
              message={
                "Công thức đầu tiên của bạn hiện đã có trên trang bếp của bạn! Hãy hoàn thiện hồ sơ bếp của bạn để nhiều người có thể tìm thấy công thức của bạn hơn!✏️"
              }
              ago={"12 ngày trước"}
            />
            <InboxItem
              message={
                "Xem thống kê cho món Cơm chiên trứng siêu nhanh cho bữa sáng của bạn 📈"
              }
              ago={"12 ngày trước"}
            />
            <InboxItem
              message={
                "Xem thống kê cho món Cơm chiên trứng siêu nhanh cho bữa sáng của bạn 📈"
              }
              ago={"12 ngày trước"}
            />
            <InboxItem
              message={
                "Xem thống kê cho món Cơm chiên trứng siêu nhanh cho bữa sáng của bạn 📈"
              }
              ago={"12 ngày trước"}
            />
          </ul>
        </div>
      </div>
    </>
  );
}

export default Inbox;
