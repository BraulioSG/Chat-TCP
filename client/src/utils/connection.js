const { join } = require("path");
const { encrypt, decrypt } = require("./security");
const dgram = require('dgram');
const { clearInterval } = require("timers");

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
            console.log(`sent ${data} from ${this.port}`)
            if (err) {
                console.log("error on send");
                this.available = false;
                //this.client.close();
            }
            else {
                this.available = true;
            }
        })

        this.timeout = setTimeout(() => {
            this.available = false;
            console.log(`server timeout ${this.port}`)
            //this.client.close();
        }, 200)
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
                }, 250)
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
        let servers = await this.getAvailableServer();
        console.log(servers.map(s => s.port));

        if (servers.length < 1) {
            const interval = setInterval(async () => {
                console.log("no servers available")
                console.log("couldn't send " + command)
                servers = await this.getAvailableServer();

                if (servers.length >= 1) {
                    servers[0].send(command);
                    clearInterval(interval);
                }
            }, 1000)

        } else {
            servers[0].send(command);
        }


    }

    setCallback(callback) {
        this.callback = callback;
    }
}

module.exports = Connection;
