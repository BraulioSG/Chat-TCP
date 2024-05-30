const net = require('node:net');
const fs = require('node:fs')
const { handleCommand } = require('./commandHandler');
const { json } = require('stream/consumers');

// Create a server
const server = net.createServer((socket) => {
    console.log('Server connected');

    socket.on('data', (data) => {
        const req = data.toString();
        console.log(`Received: ${req}`);

        const res = handleCommand(req);

        socket.write(Buffer.from("RESPONSE", 'ascii'));
        socket.write(Buffer.from("TO", 'ascii')); //agregar los usuarios
        socket.write(Buffer.from("START", 'ascii'));
        try {
            const data = JSON.stringify(res);
            const buff = Buffer.from(data, 'ascii')
            for (let i = 0; i < buff.length; i += 1024) {
                const chunks = buff.slice(i, i + 1024)
                socket.write(chunks);
            }
        } catch (errr) {
            console.log(err);
        }
        socket.write(Buffer.from("END", 'ascii'));
        socket.destroy();
    });

    socket.on('end', () => {
        console.log('Server disconnected');
    });

    socket.on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Controller on port ${PORT}`);
});

server.on('error', (err) => {
    console.error(`Controller error: ${err.message}`);
});