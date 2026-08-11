import { API } from "../config/api.js";

export function createImage(file) {
    const img = document.createElement("img");

    img.src = `${API}/${file.path}`;
    img.style.width = `${file.finalWidth}px`;
    img.style.height = `${file.finalHeight}px`;

    return img;
}
