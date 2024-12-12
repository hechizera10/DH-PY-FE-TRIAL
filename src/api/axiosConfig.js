import axios from "axios";

console.log('API URL:', import.meta.env.VITE_API_URL || "http://localhost:8080");

export const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Interceptor para incluir el token en cada solicitud
// axiosConfig.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default axiosConfig;