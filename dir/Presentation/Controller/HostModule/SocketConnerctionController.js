"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketConnectionController = void 0;
var socketIo = require('socket.io');
var SocketConnectionController = /** @class */ (function () {
    function SocketConnectionController() {
        this.users = {};
        this.hosts = [];
    }
    SocketConnectionController.prototype.initialize = function (server) {
        var _this = this;
        var io = socketIo(server, {
            cors: {
                origin: '*',
                credentials: false
            }
        });
        io.on('connection', function (client) {
            console.log('A new connection has appeared', client.client.id);
            _this.users[client.id] = client.id;
            console.log('Current list of users', Object.keys(_this.users));
            client.on('join', function (data) {
                _this.hosts.push(data);
                client.join(data.host);
                console.log('connected id:', client.id, '; in host :', data.host, ' email: ', data.email);
                client.on('disconnect', function () {
                    console.log('disconnected!', data.host, data.email);
                    delete _this.users[client.id];
                    client.to(data.host).broadcast.emit('user-disconnected', data.email);
                    var clients = io
                        .of('/')
                        .in(data.host)
                        .clients(function (error, clients) {
                        client.emit('all_users', clients);
                    });
                });
                var clients = io
                    .of('/')
                    .in(data.host)
                    .clients(function (error, clients) {
                    client.emit('all_users', clients);
                });
                client.to(data.host).broadcast.emit('all_info', _this.hosts);
                console.log(_this.hosts);
            });
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
            client.on('initiate', function (data) {
                console.log('Sending p2pRequest to', data.recipient);
                try {
                    io.to(data.recipient).emit('p2prequest', data);
                }
                catch (err) {
                    console.log('Error!', err);
                }
            });
            client.on('acknowledge_request', function (data) {
                io.to(data.recipient).emit('acknowledge', data);
            });
        });
    };
    return SocketConnectionController;
}());
exports.SocketConnectionController = SocketConnectionController;
