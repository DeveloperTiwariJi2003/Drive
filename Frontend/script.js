const token = localStorage.getItem("token");
const authHeader = {headers: {Authorization: `Bearer ${token}`}};

if (!token) {
    window.location.href = 'http://localhost:5000/login.html';
}
async function sendData() {
    // console.log("running send data");
    const file = document.getElementById("file").files[0];
    const formData = new FormData();
    formData.append("data", file);
    const res = await axios.post("http://localhost:5000/api/upload", formData,authHeader);
    const confirmation = document.getElementById("confirmation");
    confirmation.innerText = "File(s) uploaded successfully";
    showFiles();
    // console.log(res.data);
}

async function showFiles() {
    let res;
    // console.log(res);
    try {

         res = await axios.get(
            "http://localhost:5000/api/files",
            authHeader
        );

        console.log(res.data);

    } catch (err) {

        if (err.response && err.response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "/login.html";
        }

    }
    const ul = document.getElementById('files');
    ul.innerHTML = "";
    for (const file of res.data) {
        const li = document.createElement('li');
        const id = file._id;
        const btn = document.createElement('button');
        btn.type = "button";
        const dwnld= document.createElement('button');
        dwnld.type="button";
        dwnld.innerText="Download";
        if (file.MimeType.startsWith("image/")) {
            const img = document.createElement('img');
            img.src = `http://localhost:5000/${file.path}`;
            img.style.width = "150px";
            img.style.margin = "10px";
            btn.id = "delete";
            btn.dataset.id = id;
            btn.innerText = "delete";
            // console.log(file._id);
            // console.log(btn);
            const a = document.createElement('a');
            a.href = `http://localhost:5000/${file.path}`;
            // a.innerText = file.filename
            a.target = "_blank";
            btn.addEventListener("click",async (e)=>{
                const id = e.currentTarget.dataset.id;
                console.log(id);
                await axios.delete(`http://localhost:5000/api/file/${id}`,authHeader);
                li.remove();
            })

            a.appendChild(img);
            li.appendChild(a);
            li.appendChild(btn);
            li.appendChild(dwnld);
            ul.appendChild(li);
        } else if (file.MimeType === "application/pdf") {
            const iframe = document.createElement("iframe");
            iframe.src = `http://localhost:5000/${file.path}#toolbar=0`;
            iframe.width = "100";
            iframe.height = "100";
            btn.id = "delete";
            btn.dataset.id = id;
            btn.innerText = "delete";
            // iframe.style.overflow = "hidden";
            const link = document.createElement("a");
            link.href = `http://localhost:5000/${file.path}`;
            link.innerText = "Open PDF";
            link.target = "_blank";
            console.log(btn);
            
            btn.addEventListener("click",async (e)=>{
                const id = e.currentTarget.dataset.id;
                console.log(id);
                await axios.delete(`http://localhost:5000/api/file/${id}`,authHeader);
                li.remove();
            })
            li.appendChild(iframe);
            li.appendChild(link);
            li.appendChild(btn);
            ul.appendChild(li);
        }
    }
}
// showFiles();
async function sendManyFiles(){
    const files = document.getElementById("Manyfile").files;
    console.log(files);
    const formData = new FormData();
    for (let file of files) {
    formData.append("files", file);
}
const confirmation = document.getElementById("confirmation");
    await axios.post(`http://localhost:5000/api/uploadMany`, formData,authHeader);
    
    confirmation.innerText = "File(s) uploaded successfully";
    showFiles();
    
}



