require('dotenv').config();
const app = require('express')
const server = require('http').Server(app);

const socketController = require('./src/controllers/socket.controller');

const bootstrap = () => {
    
    socketController.initialize(server);
};

bootstrap();

const startServer = () => {
    const { address, port } = server.address()
    console.info(`app running at ${address}:${port}`)
};

server.listen(process.env.PORT || 5000, startServer)