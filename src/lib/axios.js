import axios from "axios";


export const axiosInstance = axios.create({
   baseURL:
  // import.meta.env.VITE_BACKEND_URL === "development"
  //     ? "http://localhost:4000/api"
       `${import.meta.env.VITE_BACKEND_URL}/api`,

      
  withCredentials: true,
});
axiosInstance.interceptors.response.use(
  (res) => res,
 ( err) => {
    if (err.response?.status === 401) console.warn("Unauthorized!");
    return Promise.reject(err);
  }
);
