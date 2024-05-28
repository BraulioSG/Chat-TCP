function encrypt(msg, key) {
    const buff = Buffer.from(msg, 'ascii');

    const encrypted = buff.map(char => {
        return (char + key) % 256;
    });

    return encrypted;
}

function decrypt(code, key) {

    console.log(code);
    const decrypted = code.map(char => {
        console.log(char);
        return (char - key) % 256;
    })

    console.log(decrypted)

    return decrypted.toString('ascii');
}

module.exports = { encrypt, decrypt }