import { useState } from "react";
import { useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Modal } from "@mui/material";
import axiosClient from "../api/axiosClient";
import { userContext } from "../context/UserContext";
import { toast } from "react-toastify";
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const [warning, setWarning] = useState({
    white_space: false,
    isInvalid: false,
    passwordLength: "",
    isNumber: false,
    email_Isvalid: false,
    match: true,
    token_invalid: true,
  });
  const { user, setUser } = useContext(userContext);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const localStorageData = (res) => {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };
  const handleConfirmPassword = async () => {
    setWarning((pre) => ({ ...pre, passwordLength: "" }));

    if (password.length < 10 && password.length > 0) {
      setWarning((pre) => ({ ...pre, passwordLength: "less" }));
      return;
    }
    if (password.length === 0) {
      setWarning((pre) => ({ ...pre, passwordLength: "white_space" }));
      return;
    }

    if (password !== rePassword) {
      setWarning((pre) => ({ ...pre, match: false }));
      return;
    }

    try {
      const res = await axiosClient.put("/accounts/updatePassword", {
        token,
        id,
        password,
      });

      localStorageData(res);
      toast(res.data.message);
      setUser(JSON.parse(localStorage.getItem("user")));
      navigate("/");
    } catch (error) {
      setWarning((pre) => ({ ...pre, token_invalid: false }));
    }
  };

  return (
    <>
      <Modal open={true}>
        <div className="w-[390px] scrollbar-hide overflow-y-auto absolute top-[46%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border-none outline-none p-[16px] rounded-[8px] text-[#606060]">
          <div>
            <div className="mb-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[5px]">
                <span className="font-semibold">Cài lại mật khẩu</span>
              </div>
            </div>

            <div
              className={`border w-full flex py-[8px] mb-[10px] mt-[24px] ${
                warning.passwordLength && "bg-[#FFEBF0] border-[#FFEBF0]"
              }`}
            >
              <div className="p-[8px]"></div>
              <input
                type="password"
                name="password"
                id=""
                className={`outline-none w-full pr-[10px] bg-transparent ${
                  warning.passwordLength && "placeholder:text-[#c4045a]"
                }`}
                placeholder="Mật khẩu mới (10 ký tự hoặc hơn)"
                onInput={(e) => {
                  setPassword(e.target.value);
                  setWarning((pre) => ({ ...pre, passwordLength: "" }));
                }}
              />
            </div>
            {warning.passwordLength === "less" && (
              <p className="mb-[16px] text-[1rem] leading-tight text-[#c4045a]">
                Phải có ít nhất 10 ký tự.
              </p>
            )}
            {warning.passwordLength === "white_space" && (
              <p className="mb-[16px] text-[1rem] leading-tight text-[#c4045a]">
                Mật khẩu không được để trống
              </p>
            )}

            <div
              className={`border w-full flex py-[8px] mb-[10px] mt-[15px] ${
                !warning.match && "bg-[#FFEBF0] border-[#FFEBF0]"
              }`}
            >
              <div className="p-[8px]"></div>
              <input
                type="password"
                name="repassword"
                id=""
                className={`outline-none w-full pr-[10px] bg-transparent ${
                  !warning.match && "placeholder:text-[#c4045a]"
                }`}
                placeholder="Xác nhận mật khẩu"
                onInput={(e) => {
                  setWarning((pre) => ({ ...pre, match: true }));
                  setRePassword(e.target.value);
                }}
                defaultValue={rePassword}
              />
            </div>
            {!warning.match && (
              <p className="mb-[16px] text-[1rem] leading-tight text-[#c4045a]">
                Xác nhận mật khẩu không chính xác
              </p>
            )}
            {!warning.token_invalid && (
              <p className="mb-[16px] text-[1.4rem] leading-tight text-[#c4045a]">
                Token không hợp lệ
              </p>
            )}
            <Button
              text={"Gửi"}
              color={"#f93"}
              px={"24px"}
              py={"8px"}
              textColor={"#ffff"}
              borderColor={"#f93"}
              widthFull={true}
              onClick={handleConfirmPassword}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ResetPassword;
