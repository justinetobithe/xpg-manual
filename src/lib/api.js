import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 15000,
});

api.interceptors.response.use(
    (r) => r,
    (e) => Promise.reject(e)
);

export default api;
