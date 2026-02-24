import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE ?? "/v1/";

export const api = axios.create({
    baseURL,
    withCredentials: true, // später Cookie-Session
    timeout: 30_000,
});
