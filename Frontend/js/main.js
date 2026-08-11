import { checkAuth } from "./auth/auth.js";
import { showFiles } from "./gallery/gallery.js";
import { sendManyFiles } from "./upload/upload.js";
import { DeleteSelected } from "./delete/deleteSelected.js";
import { toggleSelectionMode } from "./selection/selection.js";

checkAuth();

const uploadBtn = document.getElementById("uploadBtn");
const selectBtn = document.getElementById("selectBtn");
const mobileSelectBtn = document.getElementById("mobileSelectBtn");
const refreshIcon = document.getElementById("refreshIcon");
const fileInput = document.getElementById("Manyfile");
const mobileUploadButton = document.getElementById("mobileuploadButton");
const deleteSelectedBtn = document.getElementById("DeleteSelectedBtn");

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        uploadBtn.classList.remove("d-none");

        uploadBtn.textContent =
            `Upload ${fileInput.files.length} File${
                fileInput.files.length > 1 ? "s" : ""
            }`;
    } else {
        uploadBtn.classList.add("d-none");
    }
});

uploadBtn.addEventListener("click", async () => {
    const files = fileInput.files;

    await uploadFiles(files);

    uploadBtn.classList.add("d-none");
    fileInput.value = "";
});

mobileUploadButton.addEventListener("click", async () => {
    const input = document.getElementById("mobileManyFiles");
    const files = input.files;
    document.getElementById("mobileUpload").style.display = "none";
    await uploadFiles(files);

    input.value = "";
    
});

async function uploadFiles(files) {
    if (!files || files.length === 0) return;

    const confirmation = document.getElementById("confirmation");
    const progressBar = document.getElementById("progressBar");

    try {
        await sendManyFiles(files, percent => {
            progressBar.style.width = `${percent}%`;
            progressBar.innerText = `${percent}%`;
        });

        confirmation.innerText = "File(s) uploaded successfully";

        setTimeout(() => {
            progressBar.style.width = "0%";
            progressBar.innerText = "";
            confirmation.innerText = "";
        }, 3000);

        showFiles();
    } catch (error) {
        confirmation.innerText = "Upload Failed";

        progressBar.style.width = "0%";
        progressBar.innerText = "";

        console.error(error);
    }
}

selectBtn.addEventListener("click", toggleSelectionMode);
mobileSelectBtn.addEventListener("click", toggleSelectionMode);

deleteSelectedBtn.addEventListener(
    "click",
    DeleteSelected
);

refreshIcon.addEventListener("click", () => {
    refreshIcon.classList.add("spin");

    showFiles();

    setTimeout(() => {
        refreshIcon.classList.remove("spin");
    }, 3000);
});

showFiles();
