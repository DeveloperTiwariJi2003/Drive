import { uploadFile, uploadManyFiles } from "../api/fileApi.js";

export async function sendData(file) {
    const formData = new FormData();
    formData.append("data", file);

    return uploadFile(formData);
}

export async function sendManyFiles(files, onProgress) {
    const formData = new FormData();

    for (const file of files) {
        formData.append("files", file);
    }

    return uploadManyFiles(formData, {
        onUploadProgress(event) {
            if (!event.total) return;

            const percent = Math.round(
                (event.loaded / event.total) * 100
            );

            onProgress?.(percent);
        }
    });
}
