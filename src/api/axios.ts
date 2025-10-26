import axios from "axios";
import { authStore } from "@/store/auth.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use(
    (response)=> response,
    (error) => {
        if (error.response && error.response.status === 403 && error.response.data.details == "Could not validate credentials") {
            authStore.logout();
        }
    }
)

export default api;
