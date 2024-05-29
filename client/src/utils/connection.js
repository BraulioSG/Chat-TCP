const { encrypt, decrypt } = require("./security");
const dgram = require('dgram');

class Client {
    constructor(callback, primaryServer, primaryPort, backupServer, backupPort) {
        this.callback = callback;
        this.client = dgram.createSocket('udp4'); // For IPv4

        this.primaryServerAddress = primaryServer;
        this.primaryServerPort = primaryPort;

        this.backupServerAddress = backupServer;
        this.backupServerPort = backupPort;

        this.key = 10;
        this.isUsingBackup = false;

        this.client.on('message', (msg, _rinfo) => {
            const data = decrypt(msg, this.key);
            this.callback(data);
        });

        this.client.on('error', (err) => {
            console.error(`Socket error:\n${err.stack}`);
            this.client.close();
        });

        this.client.on('close', () => {
            console.log('Socket closed');
        });
    }

    send(command) {
        const req = encrypt(command, this.key);
        const { serverAddress, serverPort } = this.isUsingBackup
            ? { serverAddress: this.backupServerAddress, serverPort: this.backupServerPort }
            : { serverAddress: this.primaryServerAddress, serverPort: this.primaryServerPort };

        this.client.send(req, serverPort, serverAddress, (err) => {
            if (err) {
                console.error(err);
                this.client.close();
                if (!this.isUsingBackup) {
                    console.log("Switching to backup server...");
                    this.isUsingBackup = true;
                    this.client = dgram.createSocket('udp4'); // Recreate the socket to switch server
                    this.send(command); // Retry with backup server
                } else {
                    console.error("Both primary and backup servers failed.");
                }
            } else {
                console.log(`Sent ${command} to ${serverAddress}:${serverPort}`);
            }
        });
    }

    setCallback(callback) {
        this.callback = callback;
    }
}

module.exports = Client;
