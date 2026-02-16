import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
 ( err) => {
    if (err.response?.status === 401) console.warn("Unauthorized!");
    return Promise.reject(err);
  }
);
