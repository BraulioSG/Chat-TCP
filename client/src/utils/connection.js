const net = require("node:net");
const { encrypt, decrypt } = require("./security");

const SERVER_ADDR = '127.0.0.1';
const SERVER_PORT = 5000;

const client = new net.Socket();

client.connect(SERVER_PORT, SERVER_ADDR, () => {
    console.log('Connected');
    client.write(encrypt("abcdefghijklmnopqrstuvwxyz1234567890!#$%&/()=?", 10));
});

client.setTimeout(1000);
client.on('timeout', () => {
    console.log("socket timeout");
    client.destroy();
})

client.on('data', (data) => {
    data = decrypt(data.toString(), 10);
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
});

client.on('close', () => {
    console.log('Connection closed');
});

module.exports = client;