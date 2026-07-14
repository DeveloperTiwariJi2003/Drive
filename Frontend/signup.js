const API =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "";
async function signUp(){
    const alert_message = document.getElementById('alert')
    try {
        const form = document.getElementById('signup');
        
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());
    const res = await axios.post(`${API}/signup`,data);
    alert("account created successfully");//////i was dping alert message on frontend 
    window.location.href = `${API}/login.html`;
     
    console.log(res);
    } catch (error) {
        if(error.response?.status==409){
            alert_message.innerText = "user already registered";
        }else {
            alert_message.innerText = "Something went worng";
        }
    }
}
async function login(){
    window.location.href = `${API}/login.html`;
}