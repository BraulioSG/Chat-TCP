function encrypt(msg, key) {
    const buff = Buffer.from(msg, 'ascii');

    const encrypted = buff.map(char => {
        return (char + key) % 256;
    });

    return encrypted;
}

function decrypt(code, key) {

    const decrypted = code.map(char => {
        return (char - key) % 256;
    })


    return decrypted.toString('ascii');
}

module.exports = { encrypt, decrypt }