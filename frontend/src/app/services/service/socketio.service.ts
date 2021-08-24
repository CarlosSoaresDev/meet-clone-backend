declare var SimplePeer: any;
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISocketioInterface } from '../contract/isocketio.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketioService implements ISocketioInterface {

  socket: SocketIOClient.Socket;
  peer: any;
  peersMap: object = {};
  stream: MediaStream = null;

  constructor() { }

  peerList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  personList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  joinRoom(hostRoom: string, isHost: boolean, email: string, picture: string, name): void {

    this.socket.emit('join', {
      host: hostRoom,
      isHost: isHost,
      caller: this.socket.id,
      email: email,
      picture: picture,
      name: name
    });

    this.socket.on('all_users', (users: any) => {
      this.initPeersMap(users, hostRoom);
    });

    this.socket.on('all_info', (persons) => {
        this.initPersonMap(persons)

        console.log(persons)
      });



    this.socket.on('p2prequest', (data) => {
      this.addPeer(data);
    });

    this.socket.on('acknowledge', (data) => {
      console.log('Handshake completed for', data.caller);
      this.peersMap[data.caller].signal(data.signal);
    });
  }

  addStream(stream: MediaStream): void {
    Object.keys(this.peersMap).forEach((item) => {
      this.peersMap[item].addStream(stream);
    });
    this.peerList.next(Object.values(this.peersMap));
    this.stream = stream;
  }

  removeStream(): void {
    Object.keys(this.peersMap).forEach((item) => {
      this.peersMap[item].removeStream(this.stream);
    });
  }

  addPeer(data): void {
    if (!this.peersMap[data.caller]) {
      console.log('Adding peer...');
      var peer = new SimplePeer({
        initiator: false,
        trickle: false,
      });

      this.peersMap[data.caller] = peer;
      this.peerList.next(Object.values(this.peersMap));

      peer.signal(data.signal);

      peer.on('signal', (signal) => {
        this.socket.emit('acknowledge_request', {
          caller: this.socket.id,
          signal: signal,
          recipient: data.caller,
        });
      });
    }

    else {
      console.log('This peer already exists in map');
      this.peersMap[data.caller].signal(data.signal);
    }
  }

  initPeersMap(users, hostRoom: string): void {
    //For each user returned, create a new peer and map the user's socket id to it.
    users.forEach((userId: string) => {
      //Don't add a peer for your own socket id.
      if (userId === this.socket.id) {
        return;
      }
      var peer = new SimplePeer({
        initiator: true,
        trickle: false,
      });
      this.peersMap[userId] = peer;
      peer.on('signal', (signal) => {
        console.log('initiating the p2p request');
        this.socket.emit('initiate', {
          recipient: userId,
          caller: this.socket.id,
          signal: signal,
          hostRoom: hostRoom,
        });
      });
    });

    this.peerList.next(Object.values(this.peersMap));
  }

  initPersonMap(person): void {
    this.personList.next(Object.values(person));
  }

  get getSocketId(): string {
    return this.socket.id;
  }

  get getPeersList(): Observable<any[]> {
    return this.peerList.asObservable();
  }

  get getPersonList(): Observable<any[]> {
    return this.personList.asObservable();
  }
}
