const token = localStorage.getItem("token");
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
async function showFiles() {
    let res;
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
    const ul = document.getElementById('files');
    ul.innerHTML = "";

    for (const file of res.data) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.display = selection_mode ? "block" : "none";
        const li = document.createElement('li');
        li.classList.add("file-card");
        const id = file._id;
        li.dataset.id = file._id;
        checkbox.dataset.id = file._id;


        checkbox.addEventListener("click", (e) => {
            e.stopPropagation();
            if (checkbox.checked) {
                id_to_delete_many.add(checkbox.dataset.id);
            } else {
                id_to_delete_many.delete(checkbox.dataset.id);
            }
            console.log(id_to_delete_many);
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
        delete_btn.className=""
        dwnld.type = "button";
        dwnld.innerText = "Download";

        const button_div=document.createElement("div");
        button_div.className=("button_ddiv");
        button_div.appendChild(delete_btn);
        button_div.appendChild(dwnld);
        if (file.MimeType.startsWith("image/")) {
            const img = document.createElement('img');
            img.src = `${API}/${file.path}`;
            delete_btn.id = "delete";
            delete_btn.dataset.id = id;
            delete_btn.innerText = "delete";
            // console.log(file._id);
            // console.log(delete_btn);
            const a = document.createElement('a');
            a.href = `${API}/${file.path}`;
            // a.innerText = file.filename
            a.target = "_blank";
            delete_btn.addEventListener("click", async (e) => {
                const id = e.currentTarget.dataset.id;
                console.log(id);
                await axios.delete(`${API}/api/file/${id}`, authHeader);
                li.remove();
            })

            a.appendChild(img);
            li.appendChild(a);
            // li.appendChild(delete_btn);
            // li.appendChild(dwnld);
            li.appendChild(button_div);
            li.appendChild(checkbox);
            ul.appendChild(li);
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
    }
}
// showFiles();
async function sendManyFiles() {
    const file_input_field = document.getElementById("Manyfile");
    const files = document.getElementById("Manyfile").files;
    const formData = new FormData();
    const Show_percent_on_frontend = document.getElementById("percent");
    for (let file of files) {
        formData.append("files", file);
    }
    const confirmation = document.getElementById("confirmation");

    await axios.post(`${API}/api/uploadMany`, formData, {
        ...authHeader, onUploadProgress: function (progressEvent) {
            // console.log(progressEvent);

            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            document.getElementById("progressBar").style.width = `${percent}%`;
             document.getElementById("progressBar").innerText = `${percent}%`;
            document.getElementById("progressText").textContent = `${percent}%`;
            // console.log(percent);
            // Show_percent_on_frontend.innerText = percent;
            if (progressEvent.upload == true) {
                confirmation.innerText = "File(s) uploaded successfully";
                file_input_field.value = "";
            } else {
                confirmation.innerText = "Upload Failed";
            }
        }

    });
    // console.log("sending files ");

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

const fileInput = document.getElementById("Manyfile");
const uploadBtn = document.getElementById("uploadBtn");

fileInput.addEventListener("change", () => {

    if(fileInput.files.length > 0){
        uploadBtn.classList.remove("d-none");
        uploadBtn.textContent = `Upload ${fileInput.files.length} File${fileInput.files.length > 1 ? "s" : ""}`;
    }else{
        uploadBtn.classList.add("d-none");
    }

});
const refreshIcon = document.getElementById("refreshIcon");

refreshIcon.addEventListener("click", () => {
    console.log("icon click fired");
    refreshIcon.classList.add("spin");
    // Your refresh function
    showFiles();
    setTimeout(() => {
        refreshIcon.classList.remove("spin");
    }, 3000);
});


showFiles();


