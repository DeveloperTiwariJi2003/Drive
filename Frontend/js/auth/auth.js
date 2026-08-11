import { API } from "../config/api.js";

export const token = localStorage.getItem("token");

export const authHeader = {
    headers: {
        Authorization: `Bearer ${token}`
    }
};

export function checkAuth() {
    if (!token) {
        window.location.href = `${API}/login.html`;
    }
}

export function handleUnauthorized(error) {
    if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = `${API}/login.html`;
    }
}
