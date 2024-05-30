const { join } = require("path");
const { encrypt, decrypt } = require("./security");
const dgram = require('dgram');

class Server {


    constructor(address, port, callback) {
        this.address = address;
        this.port = port;
        this.available = false;
        this.client = dgram.createSocket('udp4');

        this.timeout = undefined;

        this.response = ""

        this.client.on('message', (msg, _rinfo) => {
            clearTimeout(this.timeout);
            const data = decrypt(msg, 10);
            this.available = true;

            if (data === "pong") {
                return;
            }
            else {
                this.response = this.response.concat(data);
                if (data.endsWith("\nEND")) {

                    callback(this.response);
                    this.response = "";

                }
            }
        })
    }


    send(data) {
        this.client.send(encrypt(data, 10), this.port, this.address, (err) => {
            if (err) {
                this.available = false;
                this.client.close();
            }
        })

        this.timeout = setTimeout(() => {
            this.available = false;
            //this.client.close();
        }, 100)
    }
}

class Connection {
    constructor(callback, ...ports) {
        this.servers = [];

        ports.forEach(port => {
            this.servers.push(new Server("127.0.0.1", port, callback));
        })
    }

    async getAvailableServer() {
        let servers = []

        const sendPing = (server) => {
            return new Promise((resolve, reject) => {
                server.send("ping");

                setTimeout(() => {
                    resolve(server.available);
                }, 110)
            })
        }

        for (let i = 0; i < this.servers.length; i++) {
            const available = await sendPing(this.servers[i]);
            if (available) {
                servers.push(this.servers[i]);
            }
        }

        return servers;
    }

    async send(command) {
        const servers = await this.getAvailableServer();

        if (servers.length < 1) {
            console.log("no servers available")
            return null;
        }

        console.log(servers.map(server => server.port));
        servers[0].send(command);
    }

    setCallback(callback) {
        this.callback = callback;
    }
}

module.exports = Connection;
