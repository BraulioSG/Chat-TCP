const net = require('node:net');
const fs = require('node:fs')

// Create a server
const server = net.createServer((socket) => {
    console.log('Server connected');

    socket.on('data', (data) => {
        const req = data.toString();
        console.log(`Received: ${req}`);


        socket.write(Buffer.from("RESPONSE\n", 'ascii'));
        socket.write(Buffer.from("TO usr-001 usr-002\n", 'ascii')); //agregar los usuarios
        socket.write(Buffer.from("START\n", 'ascii'));
        try {
            const data = fs.readFileSync('./file.json', 'ascii');
            const buff = Buffer.from(data, 'ascii');

            for (let i = 0; i < buff.length; i += 1024) {
                const chunk = buff.slice(i, i + 1024);
                socket.write(chunk);
            }

        } catch (err) {
            console.error(err);
        }
        socket.write(Buffer.from("\nEND", 'ascii'));


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