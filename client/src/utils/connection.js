const { encrypt, decrypt } = require("./security");

const dgram = require('dgram');
const client = dgram.createSocket('udp4'); // For IPv4

const serverPort = 8080;
const serverAddress = '127.0.0.1';

client.send(encrypt("abcdefghijklmnopqrstuvwxyz1234567890!#$%&/()=?", 10), serverPort, serverAddress, (err) => {
    if (err) {
        console.error(err);
        client.close();
    } else {
        console.log('Message sent');
    }
});

client.on('message', (msg, rinfo) => {
    console.log(decrypt(msg, 10))
});

client.on('error', (err) => {
    console.error(`Socket error:\n${err.stack}`);
    client.close();
});

client.on('close', () => {
    console.log('Socket closed');
});

module.exports = client;