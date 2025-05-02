import axios from "axios";
export const axiosInstance  = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    withCredentials: true,
    headers: {
        // 'Content-Type': 'application/json',  // Đặt tiêu đề Content-Type mặc định cho các yêu cầu gửi dữ liệu dạng FormData
      },
})

// Thêm interceptor để thêm token vào tiêu đề Authorization
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // If the response is successful, return it
  (error) => {
    // Check if the error response exists and if it contains rate limiting error
    if (error.response && error.response.status === 429) {
      // Display notification for rate limit exceeded
      alert("Too many requests, please try again later.");
    }
    return Promise.reject(error); // Return the error to be handled elsewhere
  }
);

// axiosInstance .interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Nếu access token hết hạn
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Gọi API refresh-token (BE sẽ đọc refresh-token từ cookie)
//         await axiosInstance.post("/auth/refresh-token");

//         // Sau khi BE set lại cookie mới → retry request cũ
//         return axiosInstance (originalRequest);
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (err) {
//         // Nếu refresh token cũng hết hạn → logout
//         window.location.href = "/signin";
//       }
//     }

//     return Promise.reject(error);
//   }
// );
