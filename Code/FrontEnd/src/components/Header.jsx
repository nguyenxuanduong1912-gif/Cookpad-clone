import { LuLink, LuPlus } from "react-icons/lu";
import Button from "./Button";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react/headless";
import { Modal } from "@mui/material";
import LoginCard from "./LoginCard";
import "tippy.js/dist/tippy.css";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useContext } from "react";
import { HistoryContext } from "../context/HistoryContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axiosClient from "../api/axiosClient";
import { userContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MyGoogleButton from "./MyGoogleButton";
function Header({
  search,
  navigation,
  addRecipe,
  setDraft,
  setUpdate,
  userLogin,
  setUserLogin,
  loading,
  primaryInput,
  setPrimaryInput,
  dataSuggest,
  setDataSuggest,
  updateRecipe,
  recipeId,
  setRecipeId,
  openLogin,
  setOpenLogin,
}) {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const { user, setUser } = useContext(userContext);
  const [step, setStep] = useState(1);
  const { openHistory, setOpenHistory } = useContext(HistoryContext);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [typeInput, setTypeInput] = useState("password");
  const [email, setEmail] = useState("");
  const [emailForgotPass, setEmailForgotPass] = useState("");
  const [keyword, setkeyWord] = useState();
  const location = useLocation();
  const { id } = useParams();
  const [warning, setWarning] = useState({
    white_space: false,
    isInvalid: false,
    passwordLength: "",
    isNumber: false,
    email_Isvalid: false,
    match: true,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword");
    setkeyWord(keyword);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.search]);
  useEffect(() => {
    setVisible(false);
  }, [user]);
  useEffect(() => {
    if (updateRecipe) {
      setRecipeId(id);
    }
  }, []);
  const handleSubmitNext = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());
    const email = obj.email;

    setWarning((pre) => ({
      white_space: false,
      isInvalid: false,
    }));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setWarning((pre) => ({ ...pre, white_space: true }));
      return;
    }

    if (!emailRegex.test(email)) {
      setWarning((pre) => ({ ...pre, isInvalid: true }));
      return;
    }

    const res = await axiosClient.get("/accounts/getUserByEmail", {
      params: {
        email: email,
        provider: "google",
      },
    });
    if (res.data.user) {
      if (res.data.google) {
        console.log("Tài khoản đã liên kết với google");
        setStep(10);
        setUserLogin({
          email: res.data.user.email,
          fullName: res.data.user.fullName,
          avatar: res.data.user.avatar,
        });
      }
    } else {
      const res = await axiosClient.get("/accounts/getUserByEmail", {
        params: {
          email: email,
        },
      });
      if (res.data.user) {
        setStep(9);
        return;
      }
      setEmail(email);
      setStep(3);
    }
  };

  const handleCheckPassword = async () => {
    setWarning((pre) => ({ ...pre, passwordLength: "" }));

    if (password.length < 10 && password.length > 0) {
      setWarning((pre) => ({ ...pre, passwordLength: "less" }));
      return;
    }
    if (password.length === 0) {
      setWarning((pre) => ({ ...pre, passwordLength: "white_space" }));
      return;
    }

    setStep(4);
  };
  const handleCheckPasswordLogin = async () => {
    if (!password.trim()) {
      setWarning((pre) => ({ ...pre, white_space: true }));
      return;
    }

    try {
      const res = await axiosClient.post("/accounts/login", {
        email,
        password,
      });

      toast(res.data.message);
      localStorageData(res);
      setUser(JSON.parse(localStorage.getItem("user")));
      setStep(1);
      setOpenLogin(false);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  const handleFullName = () => {
    const [name, domain] = email.split("@");
    setFullName(name);
  };
  const handleCheckFullName = async () => {
    setWarning((pre) => ({ ...pre, white_space: false, isNumber: false }));
    if (!isNaN(Number(fullName)) && fullName !== "") {
      setWarning((pre) => ({ ...pre, isNumber: true }));
      return;
    }
    if (!fullName.trim()) {
      setWarning((pre) => ({ ...pre, white_space: true }));
      return;
    }
    try {
      const res = await axiosClient.post("/accounts/register", {
        email,
        password,
        fullName,
      });
      toast(res.data.message);
      localStorageData(res);
      setUser(JSON.parse(localStorage.getItem("user")));
      setStep(1);
      setOpenLogin(false);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  const localStorageData = (res) => {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };
  const handleRePassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailForgotPass.trim()) {
      setWarning((pre) => ({ ...pre, email_Isvalid: true }));
      return;
    }
    if (!emailRegex.test(emailForgotPass)) {
      setWarning((pre) => ({ ...pre, email_Isvalid: true }));
      return;
    }
    try {
      const res = await axiosClient.post("/accounts/changePassword", {
        email: emailForgotPass,
      });
      toast(res.data.message);
      setStep(7);
    } catch (error) {
      console.log(error);
    }

    setStep(7);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    window.location.href = "/";
  };
  useEffect(() => {
    const fetchData = async () => {
      if (primaryInput === "") {
        setDataSuggest([]);
        return;
      }
      try {
        const res = await axiosClient.get("/recipes/suggest", {
          params: { keyword: primaryInput },
        });
        setTimeout(() => {
          setDataSuggest(res.data.suggestions);
        }, 100);
      } catch (error) {
        toast(error.response.data.message);
      }
    };
    fetchData();
  }, [primaryInput]);
  return (
    <>
      <Modal open={openLogin}>
        <div className="w-[390px] scrollbar-hide overflow-y-auto absolute top-[46%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border-none outline-none p-[16px] rounded-[8px] text-[#606060]">
          {step === 1 && (
            <div>
              <div className="mb-[8px] flex items-center justify-end">
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenLogin(false);
                    setPassword("");
                    setEmail("");
                  }}
                />
              </div>
              <div className="flex items-center justify-between mb-[8px]"></div>
              <ul className="flex flex-col gap-[8px]">
                <div className="mx-[45px] flex items-center justify-center flex-col">
                  <img
                    src="/logo_cookpad.png"
                    alt=""
                    className="mb-[16px] w-[180px] h-[55px] object-contain"
                  />
                  <p className="font-semibold mb-[50px]">
                    Đăng ký hoặc đăng nhập
                  </p>
                </div>
              </ul>
              {/* <LoginCard
                logo={"/google.svg"}
                text={"Tiếp tục với google"}
                color={true}
              />
              <div className="absolute top-[202px] w-full h-auto bg-white/0 z-10 left-[17px] opacity-0">
                  <GoogleLogin
                    width={357}
                    onSuccess={async (credentialResponse) => {
                      try {
                        const res = await axiosClient.post(
                          "/accounts/loginGoogle",
                          {
                            token: credentialResponse.credential,
                          }
                        );

                        setOpenLogin(false);
                        localStorageData(res);
                        toast(res.data.message);
                        setUser(JSON.parse(localStorage.getItem("user")));
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
              </div> */}
              <MyGoogleButton color={true} setOpenLogin={setOpenLogin} localStorageData={localStorageData} setUser={setUser} />
              <div className="flex items-center my-[24px] gap-[8px]">
                <span className="h-[1px] flex-1 bg-[#cececd]"></span>
                <span className="text-[1.5rem]">hoặc</span>
                <span className="h-[1px] flex-1 bg-[#cececd]"></span>
              </div>
              <div>
                <FacebookLogin
                  onSuccess={async (response) => {
                    try {
                      const res = await axiosClient.post(
                        "/accounts/loginFacebook",
                        {
                          token: response.accessToken,
                        }
                      );
                      setOpenLogin(false);
                      localStorageData(res);
                      toast(res.data.message);
                      setUser(JSON.parse(localStorage.getItem("user")));
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  appId="3035191266691791"
                  style={{
                    backgroundColor: "#4267b2",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "4px",
                    position: "absolute",
                    width: "358px",
                    height: "auto",
                    opacity: "0",
                  }}
                />
              </div>
              <LoginCard
                logo={"/facebook.svg"}
                text={"Tiếp tục với Facebook"}
                margin={true}
              />
              <LoginCard
                logo={"/email.svg"}
                text={"Tiếp tục với Email"}
                margin={true}
                onClick={() => setStep(2)}
              />
              <footer className="mt-[16px] mb-[8px]">
                <p className="text-[1.2rem]">
                  Khi sử dụng Cookpad, bạn đồng ý với Điều Khoản Dịch Vụ & Chính
                  Sách Bảo Mật của chúng tôi
                </p>
              </footer>
            </div>
          )}
          {step === 9 && (
            <div>
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <img
                    src="arrow_left.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(2);
                      setWarning((pre) => ({
                        isInvalid: false,
                        white_space: false,
                      }));
                    }}
                  />
                  <span>Đăng nhập</span>
                </div>
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setStep(1);
                    setOpenLogin(false);
                    setWarning((pre) => ({
                      isInvalid: false,
                      white_space: false,
                    }));
                  }}
                />
              </div>
              <div className="flex flex-col gap-[10px] my-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <p className="text-[1.4rem] text-[#0f0f0f]">{email}</p>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={`${typeInput}`}
                    name="password"
                    id=""
                    className={`outline-none w-full border p-[10px] pr-[40px] ${
                      warning.white_space &&
                      "placeholder:text-[#c4045a] bg-[#FFEBF0] border-[#FFEBF0]"
                    }`}
                    placeholder="Mật khẩu"
                    onInput={(e) => {
                      setPassword(e.target.value);
                      setWarning((pre) => ({ ...pre, white_space: false }));
                    }}
                    defaultValue={password}
                  />
                  {typeInput === "password" ? (
                    <img
                      src="/view.svg"
                      alt=""
                      className="w-[16px] h-[16px] absolute right-[20px] cursor-pointer"
                      onClick={() =>
                        typeInput === "password"
                          ? setTypeInput("text")
                          : setTypeInput("password")
                      }
                    />
                  ) : (
                    <img
                      src="/viewoff.svg"
                      alt=""
                      className="w-[16px] h-[16px] absolute right-[20px] cursor-pointer"
                      onClick={() =>
                        typeInput === "password"
                          ? setTypeInput("text")
                          : setTypeInput("password")
                      }
                    />
                  )}
                </div>

                {warning.white_space && (
                  <p className="mb-[16px] text-[1.2rem] leading-tight text-[#c4045a]">
                    Rất tiếc chưa đăng nhập được... Bạn vui lòng thử lại lần nữa
                    nhé!
                  </p>
                )}

                <Button
                  text={"Đăng nhập"}
                  px={"16px"}
                  py={"8px"}
                  widthFull
                  color={"#f93"}
                  textColor={"#ffff"}
                  bold
                  onClick={handleCheckPasswordLogin}
                />
                <p
                  className="text-[1.6rem] text-[#606060] font-semibold cursor-pointer text-center"
                  onClick={() => setStep(8)}
                >
                  Quên mật khẩu?
                </p>
              </div>
            </div>
          )}
          {step === 8 && (
            <div>
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <img
                    src="arrow_left.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(9);
                      setWarning((pre) => ({
                        white_space: false,
                        isInvalid: false,
                        passwordLength: "",
                        isNumber: false,
                        email_Isvalid: false,
                      }));
                    }}
                  />
                  <span>Quên mật khẩu</span>
                </div>
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setStep(1);
                    setOpenLogin(false);
                    setWarning((pre) => ({
                      isInvalid: false,
                      white_space: false,
                    }));
                  }}
                />
              </div>
              <div className="flex flex-col gap-[10px] my-[24px]">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    name="email"
                    id=""
                    className={`outline-none w-full border p-[10px] pr-[40px] ${
                      warning.email_Isvalid &&
                      "placeholder:text-[#c4045a] bg-[#FFEBF0] border-[#FFEBF0]"
                    }`}
                    placeholder="Email"
                    onInput={(e) => {
                      setEmailForgotPass(e.target.value);
                      setWarning((pre) => ({ ...pre, email_Isvalid: false }));
                    }}
                    defaultValue={emailForgotPass}
                  />
                </div>

                {warning.email_Isvalid && (
                  <p className="mb-[16px] text-[1.2rem] leading-tight text-[#c4045a]">
                    Email không hợp lệ
                  </p>
                )}

                <Button
                  text={"Gửi"}
                  px={"16px"}
                  py={"8px"}
                  widthFull
                  color={"#f93"}
                  textColor={"#ffff"}
                  bold
                  onClick={handleRePassword}
                />
              </div>
            </div>
          )}
          {step === 7 && (
            <div>
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <img
                    src="arrow_left.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(8);
                      setWarning((pre) => ({
                        white_space: false,
                        isInvalid: false,
                        passwordLength: "",
                        isNumber: false,
                        email_Isvalid: false,
                      }));
                    }}
                  />
                  <span>Kiểm tra email của bạn</span>
                </div>
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setStep(1);
                    setOpenLogin(false);
                    setWarning((pre) => ({
                      isInvalid: false,
                      white_space: false,
                    }));
                  }}
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="mt-[16px]">
                  <p className="text-[1.4rem] text-[#4a4a4a]">
                    Bạn có thể đặt lại mật khẩu của mình từ email được gửi đến
                    <span className="text-[1.6rem] font-semibold">
                      {" "}
                      {emailForgotPass}
                    </span>
                  </p>
                </div>
                <div className="mt-[24px]">
                  <img
                    src="https://global-web-assets.cpcdn.com/assets/open_email-ed8ce0415a0b8f65a3fab2f45fa56c5f90b083afeb41e53cfc5c3294fab0402c.png"
                    alt=""
                    className="mt-[4px] mb-[28px] w-[150px] h-[150px] object-contain mx-auto"
                  />
                </div>
                <Link to={"https://mail.google.com/"} target="blank">
                  <Button
                    text={"Mở email"}
                    px={"16px"}
                    py={"8px"}
                    widthFull
                    color={"#f93"}
                    textColor={"#ffff"}
                  />
                </Link>

                <Link className="text-[1.2rem] underline">
                  Tôi không nhận được email
                </Link>
              </div>
            </div>
          )}

          {step === 10 && (
            <div>
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <img
                    src="arrow_left.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(2);
                      setWarning((pre) => ({
                        isInvalid: false,
                        white_space: false,
                      }));
                    }}
                  />
                </div>
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setStep(1);
                    setOpenLogin(false);
                    setWarning((pre) => ({
                      isInvalid: false,
                      white_space: false,
                    }));
                  }}
                />
              </div>
              <div className="flex flex-col gap-[24px] my-[24px] text-center">
                {userLogin.avatar && (
                  <img
                    src={userLogin.avatar}
                    alt=""
                    className="w-[64px] h-[64px] object-contain rounded-[50%] mx-auto"
                  />
                )}
                {userLogin.fullName && (
                  <span className="text-[1.8rem] text-[#4a4a4a] font-semibold">
                    Chào mừng bạn trở lại, {userLogin.fullName}
                  </span>
                )}

                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-center gap-[8px]">
                    <img
                      src="/email.svg"
                      alt=""
                      className="w-[16px] h-[16px]"
                    />
                    {userLogin.email && (
                      <p className="text-[1.4rem] text-[#0f0f0f]">
                        {userLogin.email}
                      </p>
                    )}
                  </div>
                  <p className="text-[1.4rem] text-[#0f0f0f]">
                    Địa chỉ này đã được đăng ký với google
                  </p>
                </div>
                <LoginCard
                  logo={"google.svg"}
                  text={"Tiếp tục với google"}
                  margin={true}
                />

                <div className="absolute top-[278px] w-full h-auto bg-white/0 z-10 left-[17px] opacity-0">
                    <GoogleLogin
                      width={357}
                      onSuccess={async (credentialResponse) => {
                        try {
                          const res = await axiosClient.post(
                            "/accounts/loginGoogle",
                            {
                              token: credentialResponse.credential,
                            }
                          );

                          setOpenLogin(false);
                          localStorageData(res);
                          toast(res.data.message);
                          setUser(JSON.parse(localStorage.getItem("user")));
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                </div>
                <p
                  className="text-[1.6rem] text-[#606060] font-semibold cursor-pointer"
                  onClick={() => setStep(1)}
                >
                  Sử dụng một tài khoản khác
                </p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <img
                    src="arrow_left.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(1);
                      setWarning((pre) => ({
                        isInvalid: false,
                        white_space: false,
                      }));
                    }}
                  />
                  <span className="font-semibold">Email của bạn là gì?</span>
                </div>
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setStep(1);
                    setOpenLogin(false);
                    setWarning((pre) => ({
                      isInvalid: false,
                      white_space: false,
                    }));
                    setPassword("");
                    setEmail("");
                  }}
                />
              </div>
              <form action="" onSubmit={(e) => handleSubmitNext(e)}>
                <div
                  className={`border w-full flex py-[8px] mb-[10px] ${
                    (warning.white_space || warning.isInvalid) &&
                    "bg-[#FFEBF0] border-[#FFEBF0]"
                  }`}
                >
                  <div className="p-[8px]"></div>
                  <input
                    type="email"
                    name="email"
                    id=""
                    className={`outline-none w-full placeholder:text-[#cecece] pr-[10px] bg-[[#FFEBF0] bg-transparent ${
                      warning.white_space ||
                      (warning.isInvalid && "placeholder:text-[#c4045a]")
                    }`}
                    placeholder="Email"
                    onInput={(e) => {
                      setEmail(e.target.value);
                      setWarning((pre) => ({
                        isInvalid: false,
                        white_space: false,
                      }));
                    }}
                    defaultValue={email}
                  />
                </div>

                {warning.white_space && (
                  <p className="mb-[16px] text-[1.2rem] text-[#cc005c] leading-tight">
                    Email không được để trắng
                  </p>
                )}
                {warning.isInvalid && (
                  <p className="mb-[16px] text-[1.2rem] text-[#cc005c] leading-tight">
                    Email không hợp lệ
                  </p>
                )}

                <p className="text-[#939290] mb-[16px] text-[1rem] leading-tight">
                  Kiểm tra xem bạn đã có tài khoản Cookpad chưa, nếu chưa, bạn
                  có thể đăng ký tài khoản mới.
                </p>
                <Button
                  text={"Tiếp"}
                  color={"#f93"}
                  px={"24px"}
                  py={"8px"}
                  textColor={"#ffff"}
                  borderColor={"#f93"}
                  widthFull={true}
                  onClick={handleFullName}
                  submit
                />
              </form>
              <div className="flex items-center my-[24px] gap-[8px]">
                <span className="h-[1px] flex-1 bg-[#cececd]"></span>
                <span className="text-[1.5rem]">hoặc</span>
                <span className="h-[1px] flex-1 bg-[#cececd]"></span>
              </div>

             {/* <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const res = await axiosClient.post("/accounts/loginGoogle", {
        token: credentialResponse.credential,
      });
      setOpenLogin(false);
      localStorageData(res);
      toast(res.data.message);
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch (error) {
      console.log(error);
    }
  }}
  onError={() => console.log("Login Failed")}
  render={(renderProps) => (
    <button
      onClick={renderProps.onClick}
      disabled={renderProps.disabled}
      style={{
        padding: "12px 24px",
        backgroundColor: "#4285F4",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        width: "100%", // fill modal
      }}
    >
      Đăng nhập với Google
    </button>
  )}
/> */}
            <MyGoogleButton localStorageData={localStorageData} setOpenLogin={setOpenLogin} setUser={setUser}/>
              {/* <LoginCard
                logo={"google.svg"}
                text={"Tiếp tục với google"}
                margin={true}
              /> */}
              <div>
                <FacebookLogin
                  onSuccess={async (response) => {
                    try {
                      const res = await axiosClient.post(
                        "/accounts/loginFacebook",
                        {
                          token: response.accessToken,
                        }
                      );
                      setOpenLogin(false);
                      toast(res.data.message);
                      localStorageData(res);
                      setUser(JSON.parse(localStorage.getItem("user")));
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  appId="3035191266691791"
                  style={{
                    backgroundColor: "#4267b2",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "4px",
                    position: "absolute",
                    width: "358px",
                    height: "auto",
                    opacity: "0",
                  }}
                />
              </div>
              <LoginCard
                logo={"facebook.svg"}
                text={"Tiếp tục với Facebook"}
                margin={true}
              />
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <img
                    src="arrow_left.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(2);
                      setWarning((pre) => ({ ...pre, white_space: false }));
                    }}
                  />
                  <span className="font-semibold">Tạo mật khẩu</span>
                </div>
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setStep(1);
                    setOpenLogin(false);
                    setPassword("");
                    setEmail("");
                  }}
                />
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
                  className={`outline-none w-full placeholder:text-[#cecece] pr-[10px] bg-transparent ${
                    warning.passwordLength && "placeholder:text-[#c4045a]"
                  }`}
                  placeholder="Mật khẩu"
                  onInput={(e) => {
                    setPassword(e.target.value);
                    setWarning((pre) => ({ ...pre, passwordLength: "" }));
                  }}
                  defaultValue={password}
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

              <Button
                text={"Tạo một tài khoản mới"}
                color={"#f93"}
                px={"24px"}
                py={"8px"}
                textColor={"#ffff"}
                borderColor={"#f93"}
                widthFull={true}
                onClick={handleCheckPassword}
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <img
                    src="arrow_left.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(3);
                      setWarning((pre) => ({ ...pre, white_space: false }));
                    }}
                  />
                  <span className="font-semibold">
                    Còn chút xíu nữa là xong!
                  </span>
                </div>
                <img
                  src="/close.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    setStep(1);
                    setOpenLogin(false);
                    setPassword("");
                    setEmail("");
                  }}
                />
              </div>

              <div
                className={`border w-full flex py-[8px] mb-[10px] mt-[24px] ${
                  (warning.isNumber || warning.white_space) &&
                  "bg-[#FFEBF0] border-[#FFEBF0]"
                }`}
              >
                <div className="p-[8px]"></div>
                <input
                  type="text"
                  name="password"
                  id=""
                  className={`outline-none w-full placeholder:text-[#cecece] pr-[10px] placeholder:text-[1.4rem] bg-transparent ${
                    (warning.isNumber || warning.white_space) &&
                    "placeholder:text-[#c4045a]"
                  }`}
                  placeholder="Tên bạn (hiển thị công khai)"
                  onInput={(e) => {
                    setFullName(e.target.value);
                    setWarning((pre) => ({
                      ...pre,
                      white_space: false,
                      isNumber: false,
                    }));
                  }}
                  defaultValue={fullName}
                />
              </div>

              {warning.white_space && (
                <p className="mb-[16px] text-[1.2rem] leading-tight text-[#c4045a]">
                  Tên không để trống
                </p>
              )}
              {warning.isNumber ? (
                <p className="mb-[16px] text-[1.2rem] leading-tight text-[#c4045a]">
                  Tên không được là số
                </p>
              ) : (
                <p className="text-[#939290] mb-[16px] text-[1rem] leading-tight">
                  Tên này sẽ xuất hiện trên hồ sơ bếp của bạn.
                </p>
              )}

              <label
                htmlFor="checkbox"
                className="text-[1.1rem] flex items-start mb-[8px] cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="checkbox"
                  id="checkbox"
                  className="mr-[6px] mt-[4px] cursor-pointer"
                />
                Tôi muốn nhận các gợi ý món ngon, cảm hứng nấu ăn và các thông
                tin cập nhật khác từ Cookpad.
              </label>
              <Button
                text={"Đăng ký"}
                color={"#f93"}
                px={"24px"}
                py={"8px"}
                textColor={"#ffff"}
                borderColor={"#f93"}
                widthFull={true}
                onClick={handleCheckFullName}
              />
            </div>
          )}
        </div>
      </Modal>

      <ToastContainer position="top-right" />
      <header className="sticky bg-white z-10 top-0 left-0 w-full">
        <div
          className={`flex ${
            search || navigation ? "justify-between" : "justify-end"
          } items-center gap-[16px] h-[6.4rem] w-full px-[16px] pt-[10px]`}
        >
          {search && (
            <div className="flex items-center gap-[10px]">
              <div className="flex text-[1.6rem] bg-[#f8f6f2] h-[48px] items-center px-[8px] rounded w-[400px]">
                <img src="/search.svg" alt="" className="mr-[8px]" />
                <Tippy
                  zIndex={1}
                  visible={visible2}
                  interactive
                  onClickOutside={() => setVisible2(false)}
                  placement="bottom-end"
                  popperOptions={{
                    strategy: "fixed",
                  }}
                  render={(attrs) => (
                    <div
                      {...attrs}
                      className="w-[392px] max-h-[245px] bg-white rounded-[6px]"
                      tabIndex="-1"
                    >
                      {dataSuggest.length > 0 &&
                        dataSuggest.map((s, index) => (
                          <a
                            href={`/search?keyword=${encodeURIComponent(s)}`}
                            key={index}
                          >
                            <div className="p-[8px] flex items-center gap-[8px] text-[1.4rem] hover:bg-[#e5e7eb]">
                              <img src="/search.svg" alt="" />
                              <span>{s}</span>
                            </div>
                          </a>
                        ))}
                    </div>
                  )}
                >
                  <input
                    type="text"
                    placeholder="Tìm tên món hay nguyên liệu"
                    name="query"
                    className="border-none outline-none caret-[#f93] w-full bg-transparent placeholder:text-[1.4rem]"
                    onFocus={() => {
                      setOpenHistory(true);
                      setVisible2(true);
                    }}
                    onBlur={() => setOpenHistory(false)}
                    defaultValue={keyword}
                    onChange={(e) => setPrimaryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && primaryInput !== "") {
                        window.location.href = `/search?keyword=${encodeURIComponent(
                          primaryInput
                        )}`;
                      }
                    }}
                  />
                </Tippy>
              </div>
            </div>
          )}
          {navigation && (
            <div className="">
              <Link>
                <div className="w-[40px] h-[40px] rounded-[50%] bg-[#F8F6F2] flex items-center justify-center">
                  <img src="/arrow_left.svg" alt="" />
                </div>
              </Link>
            </div>
          )}
          <div className="flex items-center gap-[16px]">
            {!addRecipe ? (
              <>
                {user ? (
                  <Tippy
                    visible={visible}
                    interactive
                    onClickOutside={() => setVisible(false)}
                    placement="bottom"
                    popperOptions={{
                      strategy: "fixed",
                    }}
                    render={(attrs) => (
                      <div
                        className="bg-white shadow-lg rounded-2xl w-64 p-3"
                        tabIndex="-1"
                        {...attrs}
                      >
                        <div className="flex items-center gap-3 p-3 border-b overflow-hidden">
                          <div className="rounded-[50%] w-[32px] h-[32px] flex-shrink-0">
                            <Link to={"/stactistical"}>
                              <img
                                src={user.avatar}
                                alt=""
                                className="w-[32px] h-[32px] object-contain rounded-[50%]"
                              />
                            </Link>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-[1.4rem] line-clamp-1">
                              {user.fullName}
                            </div>
                          </div>
                        </div>
                        <div className="p-2 text-gray-700">
                          <Link to={`/profile/${user.id}`}>
                            <div className="py-2 hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-[5px]">
                              <img src="user.svg" alt="" /> Bếp cá nhân
                            </div>
                          </Link>
                          <hr className="my-2" />
                          <div
                            className="py-2 hover:bg-gray-100 rounded-lg cursor-pointer text-red-600 flex items-center gap-[5px]"
                            onClick={handleLogout}
                          >
                            <img src="exit.svg" alt="" /> Thoát
                          </div>
                        </div>
                      </div>
                    )}
                  >
                    <div
                      className="rounded-[50%] w-[32px] h-[32px]"
                      onClick={() => setVisible(!visible)}
                    >
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-[32px] h-[32px] object-contain rounded-[50%] cursor-pointer"
                      />
                    </div>
                  </Tippy>
                ) : (
                  <Button
                    text={"Đăng nhập"}
                    px={"16px"}
                    py={"8px"}
                    textColor={"#606060"}
                    borderColor="#cececd"
                    onClick={() => {
                      setOpenLogin(true);
                    }}
                  />
                )}

                <Button
                  text="Viết món mới"
                  color="#f93"
                  px={"16px"}
                  py={"8px"}
                  icon={<LuPlus />}
                  textColor={"#fff"}
                  borderColor="#f93"
                  onClick={() => {
                    if (user) {
                      window.location.href = "/recipe/add";
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                />
              </>
            ) : (
              <>
                {!updateRecipe && (
                  <Button
                    text={"Xóa"}
                    px={"40px"}
                    py={"8px"}
                    icon={<img src="/bin.svg" />}
                    textColor={"#FE463A"}
                    borderColor="#FE463A"
                    bold
                  />
                )}
                {!updateRecipe && (
                  <Button
                    text="Lưu và đóng"
                    px={"16px"}
                    py={"8px"}
                    textColor={"#606060"}
                    borderColor="#cececd"
                    setDraft={setDraft}
                    bold
                    submit
                  />
                )}

                {updateRecipe ? (
                  <Button
                    text="Cập nhật"
                    color="#f93"
                    px={"40px"}
                    py={"8px"}
                    textColor={"#fff"}
                    borderColor="#f93"
                    loading={loading}
                    onClick={() => setUpdate(true)}
                    submit
                  />
                ) : (
                  <Button
                    text="Lên sóng"
                    color="#f93"
                    px={"40px"}
                    py={"8px"}
                    textColor={"#fff"}
                    borderColor="#f93"
                    loading={loading}
                    submit
                  />
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
