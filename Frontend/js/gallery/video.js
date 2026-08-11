import { API } from "../config/api.js";

export function createVideo(file) {
    const video = document.createElement("video");

    video.src = `${API}/${file.path}`;
    video.controls = true;
    video.preload = "metadata";

    video.style.width = `${file.finalWidth}px`;
    video.style.height = `${file.finalHeight}px`;

    return video;
}
