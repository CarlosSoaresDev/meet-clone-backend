export interface ISocketioInterface {
    setupSocketConnection();

    joinRoom(hostRoom: string, isHost: boolean, email: string, picture: string, name): void;

    addStream(stream: MediaStream): void;

    removeStream(): void;

    addPeer(data): void;

    initPeersMap(users, hostRoom: string): void;
}