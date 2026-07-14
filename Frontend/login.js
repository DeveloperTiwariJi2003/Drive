async function login(){
    const form = document.getElementById('Login');
    const fromdata = new FormData(form);
    const data = Object.fromEntries(fromdata.entries());
    const res = await axios.post("http://localhost:5000/login",data);
    localStorage.setItem("token", res.data.token);
    console.log(localStorage.getItem("token"));
    window.location.href = 'http://localhost:5000/index.html';
    
}
async function signUp(){
    const form = document.getElementById('signup');
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());
    const res = await axios.post("http://localhost:5000/signup",data);
    window.location.href = 'http://localhost:5000/login.html';
    console.log(res);
}