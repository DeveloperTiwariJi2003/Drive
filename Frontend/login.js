const API =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "";

async function login(){
    const form = document.getElementById('Login');
    const fromdata = new FormData(form);
    const data = Object.fromEntries(fromdata.entries());
    const res = await axios.post(`${API}/login`,data);
    localStorage.setItem("token", res.data.token);
    console.log(localStorage.getItem("token"));
    window.location.href = `${API}/index.html`;
    
}
async function signUp(){
    const form = document.getElementById('signup');
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());
    const res = await axios.post(`${API}/signup`,data);
    window.location.href = 'http://localhost:5000/login.html';
    console.log(res);
}