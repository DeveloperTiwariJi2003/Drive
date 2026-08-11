import { API } from "../config/api.js";
import { authHeader } from "../auth/auth.js";

// Axios is kept as the global CDN dependency you already use in the frontend.
export async function getFiles() {
    return axios.get(`${API}/api/files`, authHeader);
}

export async function uploadFile(formData) {
    return axios.post(`${API}/api/upload`, formData, authHeader);
}

export async function uploadManyFiles(formData, config = {}) {
    return axios.post(`${API}/api/uploadMany`, formData, {
        ...authHeader,
        ...config
    });
}

export async function deleteFile(id) {
    return axios.delete(`${API}/api/file/${id}`, authHeader);
}

export async function deleteManyFiles(ids) {
    return axios.post(`${API}/api/deleteMany`, { ids }, authHeader);
}
