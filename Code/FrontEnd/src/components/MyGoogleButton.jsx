import { useGoogleLogin } from "@react-oauth/google";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import LoginCard from "./LoginCard";
const MyGoogleButton = ({ setOpenLogin, setUser, localStorageData, color }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axiosClient.post("/accounts/loginGoogle", {
          token: tokenResponse.access_token,
        });
         setOpenLogin(false);
        localStorageData(res);
        toast(res.data.message);
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch (err) {
        console.log(err);
      }
    },
    onError: () => console.log("Login failed"),
  });

  return (
    <div className="w-full h-full" onClick={() =>{
         login()
    }}>
        <LoginCard
                logo={"google.svg"}
                text={"Tiếp tục với google"}
                margin={true}
                color={color}
              />
    </div>
  );
};
export default MyGoogleButton