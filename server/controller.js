const net = require('node:net');
const handler = require('./commandHandler')

// Create a server
const server = net.createServer((socket) => {
    console.log('Server connected');

    socket.on('data', (data) => {
        const req = data.toString();
        console.log(`Received: ${req}`);

        const tokens = req.split("\t");

        console.log(tokens);



        const res = data;
        socket.write(Buffer.from(res, 'ascii'));
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