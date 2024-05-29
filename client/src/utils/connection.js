const { encrypt, decrypt } = require("./security");

const dgram = require('dgram');


class Client {
    constructor(callback) {
        this.callback = callback;
        this.client = dgram.createSocket('udp4'); // For IPv4

        this.serverAddress = '127.0.0.1';
        this.serverPort = 8080;

        this.key = 10;

        this.client.on('message', (msg, _rinfo) => {
            const data = decrypt(msg, this.key);
            this.callback(data);
        })

        this.client.on('error', (err) => {
            console.error(`Socket error:\n${err.stack}`);
            client.close();
        });

        this.client.on('close', () => {
            console.log('Socket closed');
        });
    }

    send(command) {
        const req = encrypt(command, this.key);

        this.client.send(req, this.serverPort, this.serverAddress, (err) => {
            if (err) {
                console.error(err);
                this.client.close();
            }

            console.log(`sent ${command}`)
        })
    }

    setCallback(callback) {
        this.callback = callback;
    }
}


module.exports = Client