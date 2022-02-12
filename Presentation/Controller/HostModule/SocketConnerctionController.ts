import { HostPersonDTO } from "../../../Services/DTO/HostModule/HostDTO";

const socketIo = require('socket.io')


export class SocketConnectionController {
    users: any = {};
    hosts: Array<any> = []

    initialize(server: any) {

        const io = socketIo(server, {
            cors: {
                origin: '*',
                credentials: false
            }
        })

        io.on('connection', (client: any) => {
            console.log('A new connection has appeared', client.client.id);

            this.users[client.id] = client.id;

            console.log('Current list of users', Object.keys(this.users));

            client.on('join', (data: HostPersonDTO) => {

                this.hosts.push(data)
                client.join(data.host)

                console.log('connected id:', client.id, '; in host :', data.host, ' email: ', data.email)

                client.on('disconnect', () => {
                    console.log('disconnected!', data.host, data.email)
                    delete this.users[client.id];
                    client.to(data.host).broadcast.emit('user-disconnected', data.email)

                    var clients = io
                    .of('/')
                    .in(data.host)
                    .clients(function (error: any, clients: any) {
                        client.emit('all_users', clients);
                    });
                })

                var clients = io
                    .of('/')
                    .in(data.host)
                    .clients(function (error: any, clients: any) {
                        client.emit('all_users', clients);
                    });

                client.to(data.host).broadcast.emit('all_info', this.hosts)

                console.log(this.hosts)
            })


            // client.on('join', (data: any) => {
            //     console.log(data)
            //     // if (data.isHost) {
            //     console.log('A new host has appeared !', data.caller)
            //     console.log(data)
            //     this.hosts.push(data)
            //     // } else {
            //     //     console.log('a client has joined', data.caller);
            //     // }

            //     console.log(data.hostId)

            //     client.join(data.host);

            //     var clients = io
            //         .of('/')
            //         .in(data.host)
            //         .clients(function (error: any, clients: any) {
            //             client.emit('all_users', clients);
            //         });
            // });


            client.on('initiate', (data: any) => {
                console.log('Sending p2pRequest to', data.recipient);
                try {
                    io.to(data.recipient).emit('p2prequest', data);
                } catch (err) {
                    console.log('Error!', err);
                }
            });

            client.on('acknowledge_request', (data: any) => {
                io.to(data.recipient).emit('acknowledge', data);
            });
        });
    }


}