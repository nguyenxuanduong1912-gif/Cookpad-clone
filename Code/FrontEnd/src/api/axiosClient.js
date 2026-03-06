import axios from "axios";
const API_URL = import.meta.env.VITE_URL
const axiosClient = axios.create({
   baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token} `;
  }
  return config;
});
// axiosClient.interceptors.response.use(
//   (response) => {
//     // Dữ liệu hợp lệ → trả về phần data luôn cho tiện
//     return response.data;
//   },
//   (error) => {
//     // Nếu lỗi 401 (chưa đăng nhập hoặc token hết hạn)
//     if (error.response && error.response.status === 500) {
//       console.warn("Token hết hạn hoặc không hợp lệ!");
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );
export default axiosClient;
