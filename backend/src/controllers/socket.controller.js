const socketIo = require('socket.io')

var users = {};
var hosts = [];



module.exports =  {

    initialize(server) {
       
        const io = socketIo(server, {
            cors: {
                origin: '*',
                credentials: false
            }
        })

        io.on('connection', (client) => {
            console.log('A new connection has appeared', client.client.id);

            users[client.id] = client.id;
            console.log('Current list of users', Object.keys(users));

            client.on('disconnect', () => {
                console.log('A client has disconnected :(', client.client.id);
                delete users[client.id];
                console.log('Current list of users', Object.keys(users));
            });

          
            client.on('join', (data) => {
                console.log(data)
                // if (data.isHost) {
                console.log('A new host has appeared !', data.caller)
                console.log(data)
                hosts.push(data)
                // } else {
                //     console.log('a client has joined', data.caller);
                // }

                client.join(data.host);

                clients = io
                    .of('/')
                    .in(data.host)
                    .clients(function (error, clients) {
                        client.emit('all_users', (clients));
                    });
            });

          
            client.on('initiate', (data) => {
                console.log('Sending p2pRequest to', data.recipient);
                try {
                    io.to(data.recipient).emit('p2prequest', data);
                } catch (err) {
                    console.log('Error!', err);
                }
            });

            client.on('acknowledge_request', (data) => {
                io.to(data.recipient).emit('acknowledge', data);
            });
        });
    }


}