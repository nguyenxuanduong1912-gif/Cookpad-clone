import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#faf6ef] mt-[40px] pt-[40px] pb-[30px] px-[40px] text-[#444]">
      {/* GRID 3 CỘT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px]">
        {/* CỘT 1 – GIỚI THIỆU */}
        <div>
          <h3 className="text-[1.6rem] font-semibold mb-[12px] text-[#2d2d2d]">
            Về Cookpad
          </h3>
          <p className="text-[1.35rem] leading-[2rem]">
            Cookpad giúp bạn tìm cảm hứng nấu ăn mỗi ngày, chia sẻ món ngon và
            biến việc vào bếp trở nên thú vị hơn.
          </p>

          <Link to="/" className="inline-block mt-[12px]">
            <span className="text-[1.4rem] font-semibold underline text-[#E86A33]">
              Nâng cấp Premium →
            </span>
          </Link>
        </div>

        {/* CỘT 2 – THÔNG TIN LIÊN HỆ */}
        <div>
          <h3 className="text-[1.6rem] font-semibold mb-[12px] text-[#2d2d2d]">
            Thông tin liên hệ
          </h3>

          <div className="flex items-center gap-[10px] mb-[6px]">
            <div className="bg-white shadow rounded-full p-[8px]">
              <img src="/mail.svg" className="w-[20px]" />
            </div>
            <p className="text-[1.35rem]">support@cookpad.vn</p>
          </div>

          <div className="flex items-center gap-[10px] mb-[6px]">
            <div className="bg-white shadow rounded-full p-[8px]">
              <img src="/phone.svg" className="w-[20px]" />
            </div>
            <p className="text-[1.35rem]">0394134932</p>
          </div>

          <div className="flex items-center gap-[10px]">
            <div className="bg-white shadow rounded-full p-[8px]">
              <img src="/location.svg" className="w-[20px]" />
            </div>
            <p className="text-[1.35rem]">
              123 Đường Ẩm Thực, Q.1, TP. Hồ Chí Minh
            </p>
          </div>
        </div>

        {/* CỘT 3 – MẠNG XÃ HỘI */}
        <div>
          <h3 className="text-[1.6rem] font-semibold mb-[12px] text-[#2d2d2d]">
            Kết nối với chúng tôi
          </h3>

          <div className="flex items-center gap-[16px]">
            <a href="https://facebook.com" target="_blank">
              <div className="bg-white shadow rounded-full p-[10px] hover:scale-105 transition">
                <img src="/facebook.svg" className="w-[24px]" />
              </div>
            </a>

            <a href="https://youtube.com" target="_blank">
              <div className="bg-white shadow rounded-full p-[10px] hover:scale-105 transition">
                <img src="/youtube.svg" className="w-[26px]" />
              </div>
            </a>

            <a href="https://instagram.com" target="_blank">
              <div className="bg-white shadow rounded-full p-[10px] hover:scale-105 transition">
                <img src="/instagram.svg" className="w-[24px]" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* LINE */}
      <div className="my-[24px] border-t border-[#e0d8ce]" />

      {/* COPYRIGHT */}
      <p className="text-center text-[1.3rem] text-[#777]">
        © {new Date().getFullYear()} Cookpad Vietnam — All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
