const userInput = document.getElementById("userInput");
const passInput = document.getElementById("passInput");
const form = document.getElementById("login-form");

function sendToHomePage() {
    window.location.href = window.location.href.replace("login", "home");
}

form.onsubmit = (evt) => {
    evt.preventDefault();

    const user = userInput.value;
    const pass = passInput.value;

    //avoid sending empty string
    if (user.trim().length <= 0 || pass.length <= 0) return;

    //todo: validate user and password
    window.connectionAPI.connect(`auth/lgin:user=${user}&pass=${pass}`);

    //sendToHomePage();
}

window.connectionAPI.onResponse((res) => {
    console.log(res)
});