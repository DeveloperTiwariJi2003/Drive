import { API } from "../config/api.js";

export function createPDF(file) {
    const iframe = document.createElement("iframe");

    iframe.src = `${API}/${file.path}#toolbar=0`;

    return iframe;
}
