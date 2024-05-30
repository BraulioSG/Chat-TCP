const userInput = document.getElementById("userInput");
const passInput = document.getElementById("passInput");
const form = document.getElementById("login-form");

function sendToHomePage(user_id) {
    window.location.href = window.location.href.replace("login", 'home');
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
    if (res.error !== "null") {
        if (res.error === "User not found") {
            const user = userInput.value;
            const pass = passInput.value;
            window.connectionAPI.connect(`auth/sgup:user=${user}&pass=${pass}`);
        }
        return
    } else {
        if (res.desc === "auth/sgup" || res.desc === "auth/lgin") {
            window.connectionAPI.connect(`usrs/info:token=${res.data.userId}`)
        } else if (res.desc === "usrs/info") {
            window.sessionStorage.setItem("user-info", JSON.stringify(res.data))
            sendToHomePage(res.data.userId)
        }
    }
});