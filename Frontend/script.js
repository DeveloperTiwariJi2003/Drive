const token = localStorage.getItem("token");
import { gallery_layout } from './utils.js';
const authHeader = { headers: { Authorization: `Bearer ${token}` } };
const API =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "";
if (!token) {
    window.location.href = `${API}/login.html`;
}
async function sendData() {
    // console.log("running send data");
    const file = document.getElementById("file").files[0];
    const formData = new FormData();
    formData.append("data", file);
    const res = await axios.post(`${API}/api/upload`, formData, authHeader);
    const confirmation = document.getElementById("confirmation");
    confirmation.innerText = "File(s) uploaded successfully";
    showFiles();
    // console.log(res.data);
}
let selection_mode = false;
let id_to_delete_many = new Set();
function toggleSelectionMode() {   //this one is for select and cancel button
    selection_mode = !selection_mode;
    document.getElementById("selectBtn").innerText =
        selection_mode ? "Cancel" : "Select Files";

    document.getElementById("DeleteSelectedBtn").style.display =
        selection_mode ? "inline-block" : "none";

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.style.display = selection_mode ? "block" : "none";
    });
    // showFiles();
}

async function showFiles(searchResult) {
    let res;
    if(searchResult){
        res = searchResult;
    }else{
        try {
        res = await axios.get(
            `${API}/api/files`,
            authHeader
        );
    } catch (err) {

        if (err.response && err.response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "/login.html";
        }

    }
    }
    
    // console.log("res.data = " , res.data);
    const gallery = document.getElementById("files");
    const desiredImages = gallery.clientWidth < 600 ? 5 : 10;

    const targetHeight = gallery.clientWidth / desiredImages;

    const layout = gallery_layout(res.data, gallery.clientWidth, targetHeight);
    console.table(
    layout[0].map(file => ({
        name: file.originalname,
        mime: file.MimeType,
        width: file.width,
        height: file.height,
        finalWidth: file.finalWidth,
        finalHeight: file.finalHeight
    }))
);
    // console.log(layout);
    const ul = document.getElementById('files');
    ul.innerHTML = "";

    for (const row of layout) {

        const rowDiv = document.createElement("div");
        rowDiv.className = "gallery-row";

        for (const file of row) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.style.display = selection_mode ? "block" : "none";
            const li = document.createElement('li');
            li.classList.add("photo-item");
            li.classList.add("photo-card");
            const id = file._id;
            li.dataset.id = file._id;
            checkbox.dataset.id = file._id;
            checkbox.id = "check";

            checkbox.addEventListener("click", (e) => {
                e.stopPropagation();
                if (checkbox.checked) {
                    id_to_delete_many.add(checkbox.dataset.id);
                } else {
                    id_to_delete_many.delete(checkbox.dataset.id);
                }
                // console.log(id_to_delete_many);
                li.classList.toggle("selected");
            })


            li.addEventListener("click", (e) => {
                checkbox.checked = !checkbox.checked;
                if (checkbox.checked) {
                    id_to_delete_many.add(checkbox.dataset.id);
                } else {
                    id_to_delete_many.delete(checkbox.dataset.id);
                }
                // console.log(id_to_delete_many);
                if (e.target.tagName === "BUTTON") return;
                li.classList.toggle("selected");
            })
            const delete_btn = document.createElement('button');//btn
            delete_btn.type = "button";
            const dwnld = document.createElement('button');
            dwnld.type = "button";
            dwnld.innerText = "Download";

            const button_div = document.createElement("div");
            button_div.className = ("button_ddiv");
            button_div.appendChild(delete_btn);
            button_div.appendChild(dwnld);


            const dropdown = document.createElement("div");


            if (file.MimeType.startsWith("image/")) {

                const img = document.createElement('img');
                img.src = `${API}/${file.path}`;
                img.style.width = file.finalWidth + "px";
                img.style.height = file.finalHeight + "px";
                delete_btn.id = "delete";
                delete_btn.dataset.id = id;
                delete_btn.innerText = "delete";

                dropdown.innerHTML = `
                <div class="dropdown">
                    <button class="menu-btn" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    
                    <ul class="dropdown-menu">
                        <li><button class="dropdown-item download-btn">Download</button></li>
                        <li><button id="delete" class="dropdown-item delete_btn text-danger">Delete</button></li>
                    </ul>
                </div>`;
                const deleteBtn = dropdown.querySelector(".delete_btn");
                deleteBtn.addEventListener("click", async () => {
                    const id = file._id;
                    // console.log(id);
                    await axios.delete(`${API}/api/file/${id}`, authHeader);
                    li.remove();
                })
                const a = document.createElement('a');
                a.href = `${API}/${file.path}`;
                a.target = "_blank";
                delete_btn.addEventListener("click", async (e) => {
                    const id = e.currentTarget.dataset.id;
                    // console.log(id);
                    await axios.delete(`${API}/api/file/${id}`, authHeader);
                    li.remove();
                })
                a.appendChild(img);
                li.appendChild(a);
                li.appendChild(dropdown.firstElementChild);
                // li.appendChild(button_div);
                li.appendChild(checkbox);
                rowDiv.appendChild(li);
            } else if (file.MimeType === "application/pdf") {
                const iframe = document.createElement("iframe");
                iframe.src = `${API}/${file.path}#toolbar=0`;
                // iframe.width = "100";
                // iframe.height = "100";
                delete_btn.id = "delete";
                delete_btn.dataset.id = id;
                delete_btn.innerText = "delete";
                // iframe.style.overflow = "hidden";
                const link = document.createElement("a");
                link.href = `${API}/${file.path}`;
                link.innerText = "Open PDF";
                link.target = "_blank";
                // console.log(btn);

                delete_btn.addEventListener("click", async (e) => {
                    const id = e.currentTarget.dataset.id;
                    await axios.delete(`${API}/api/file/${id}`, authHeader);
                    li.remove();
                })
                li.appendChild(iframe);
                li.appendChild(link);
                li.appendChild(delete_btn);
                ul.appendChild(li);
            }
            else if (file.MimeType.startsWith("video/")) {

                const video = document.createElement("video");
                video.src = `${API}/${file.path}`;
                video.controls = true;
                video.style.width = file.finalWidth + "px";
                video.style.height = file.finalHeight + "px";
                video.preload = "metadata";
                delete_btn.id = "delete";
                delete_btn.dataset.id = id;
                delete_btn.innerText = "Delete";
                delete_btn.addEventListener("click", async (e) => {
                    const id = e.currentTarget.dataset.id;
                    await axios.delete(`${API}/api/file/${id}`, authHeader);
                    li.remove();
                });
                const a = document.createElement("a");
                a.href = `${API}/${file.path}`;
                a.target = "_blank";
                a.appendChild(video);
                li.appendChild(a);
li.appendChild(button_div);

li.appendChild(checkbox);   
rowDiv.appendChild(li);
            }
        }
        ul.appendChild(rowDiv);
    }
}
// showFiles();
async function sendManyFiles(files) {
    console.log("send files is running");

    const file_input_field = document.getElementById("Manyfile");
    const confirmation = document.getElementById("confirmation");
    const progressBar = document.getElementById("progressBar");

    const formData = new FormData();

    for (let file of files) {
        formData.append("files", file);
    }

    try {

        await axios.post(`${API}/api/uploadMany`, formData, {

            ...authHeader,

            onUploadProgress: function (progressEvent) {

                const percent = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );

                progressBar.style.width = `${percent}%`;
                progressBar.innerText = `${percent}%`;
            }
        });

        // ONLY runs after axios request successfully finishes
        confirmation.innerText = "File(s) uploaded successfully";

        // Reset progress bar
        setTimeout(() => {
    progressBar.style.width = "0%";
    progressBar.innerText = "";
    confirmation.innerText = "";
}, 3000);

        // Clear file input
        file_input_field.value = "";

    } catch (error) {

        confirmation.innerText = "Upload Failed";

        progressBar.style.width = "0%";
        progressBar.innerText = "";

        console.error(error);
    }
    setTimeout(() => {
    confirmation.innerText = "";
}, 5000);
    showFiles();
}

async function DeleteSelected() {
    console.log("delete Selected Running");

    const formData = new FormData();
    for (const ids of id_to_delete_many) {
        formData.append("ids", ids);
    }
    // for (const [key, value] of formData.entries()) {
    // console.log(key, value);}
    id_to_delete_many.forEach(id => {
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (li) {
            li.remove();
        }
    });
    await axios.post(`${API}/api/deleteMany`, { ids: [...id_to_delete_many] }, authHeader);

    id_to_delete_many.clear();
    // showFiles();
}

const DeleteSelectBtn = document.getElementById("DeleteSelectedBtn");
DeleteSelectBtn.addEventListener("click", () => {
    DeleteSelected();
})

const fileInput = document.getElementById("Manyfile");
fileInput.addEventListener("change", () => {

    if (fileInput.files.length > 0) {
        uploadBtn.classList.remove("d-none");
        uploadBtn.textContent = `Upload ${fileInput.files.length} File${fileInput.files.length > 1 ? "s" : ""}`;
    } else {
        uploadBtn.classList.add("d-none");
    }

});
const mobileuploadButton = document.getElementById("mobileuploadButton");
    mobileuploadButton.addEventListener("click", () => {
    // console.log("mobile upload button event listener is running")
    const files = document.getElementById("mobileManyFiles").files;
    sendManyFiles(files);
    const mobileUpload = document.getElementById('mobileUpload');
    document.getElementById("mobileManyFiles").value = "";
    mobileUpload.style.display = "none";

})
// This is the refresh button which is shown on laptop
const refreshIcon = document.getElementById("refreshIcon");
refreshIcon.addEventListener("click", () => {
    // console.log("icon click fired");
    refreshIcon.classList.add("spin");
    // Your refresh function
    showFiles();
    setTimeout(() => {
        refreshIcon.classList.remove("spin");
    }, 3000);
});
const selectBtn = document.getElementById("selectBtn");
selectBtn.addEventListener("click", () => {
    toggleSelectionMode();
})
const mobileSelectBtn = document.getElementById("mobileSelectBtn");
mobileSelectBtn.addEventListener("click", () => {
    toggleSelectionMode()
})
const uploadBtn = document.getElementById("uploadBtn");
uploadBtn.addEventListener("click", () => {

    // console.log("upload button event listener is running")
    const files = document.getElementById("Manyfile").files;
    sendManyFiles(files);
    uploadBtn.classList.add("d-none");
})
const ComputerSearchBar = document.getElementById("ComputerSearchBar");
const ComputerSearchBarButton = document.getElementById("ComputerSearchBarButton");
ComputerSearchBarButton.addEventListener("click",async ()=>{
    console.log(ComputerSearchBar.value);
    const aiResponse = await axios.get(`${API}/api/ai/search?q=${encodeURIComponent(ComputerSearchBar.value)}`,authHeader);
    console.log(aiResponse.data);
    showFiles(aiResponse)
})
showFiles();


