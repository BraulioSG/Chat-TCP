function encrypt(msg, key) {
    let characters = msg.split("");

    characters = characters.map(c => {
        const ascii = c.charCodeAt(0);

        return String.fromCharCode((ascii + key) % 255);
    })

    msg = characters.join("");
    return msg;
}

function decrypt(code, key) {
    let characters = code.split("");

    characters = characters.map(c => {
        const ascii = c.charCodeAt(0);

        return String.fromCharCode((ascii - key) % 255);
    })

    code = characters.join("");
    return code;
}

module.exports = { encrypt, decrypt }