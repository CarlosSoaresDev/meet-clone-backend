import * as http from 'http';

const server = http.createServer((request: any, response: any) => {

    response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',

    });

    response.end('hey there!')
});

import { SocketConnectionController } from './Presentation/Controller/HostModule/SocketConnerctionController'

const bootstrap = () => {

    new SocketConnectionController().initialize(server);
};

bootstrap();

const startServer = () => {
    const address = server.address()
    console.info(`app running at the ${5000}`)
};

server.listen(process.env.PORT || 5000, startServer);