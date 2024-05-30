const Client = require('./Client');

const primaryServer = '127.0.0.1';
const primaryPort = 8080;
const backupServer = '127.0.0.1';
const backupPort = 8081;

const client = new Client((data) => {
    console.log(`Received response: ${data}`);
}, primaryServer, primaryPort, backupServer, backupPort);

client.send('ping');
