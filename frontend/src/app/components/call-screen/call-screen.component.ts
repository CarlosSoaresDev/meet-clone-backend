import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from 'src/app/services/service/socketio.service';
import { EventEmmitService } from 'src/app/Common/event-emmit.service';
import { Person } from 'src/app/model/person';
import { AuthService } from 'src/app/services/service/auth.service';

@Component({
  selector: 'app-call-screen',
  templateUrl: './call-screen.component.html',
  styleUrls: ['./call-screen.component.scss'],
})
export class CallScreenComponent implements OnInit {
  sources: MediaStream[] = [];
  hostId: string;
  isStreaming: boolean = false;
  persons: Array<any> = []

  person: Person =
    {
      email: null,
      family_name: null,
      given_name: null,
      granted_scopes: null,
      id: null,
      locale: null,
      name: null,
      picture: null,
      verified_email: false
    }

  constructor(
    private socketIoService: SocketioService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private eventEmmitService: EventEmmitService,
    private authService: AuthService
  ) {

    this.eventEmmitService
      .enableFullScree(true);

    this.hostId = this.route.snapshot.paramMap.get('id')

    if (this.authService.getPerson)
      this.person = this.authService.getPerson

    this.socketIoService
      .joinRoom(this.hostId, false, this.person.email, this.person.picture, this.person.name);

  }

  ngOnInit(): void {



    this.socketIoService.getPersonList
      .subscribe(person => {
        this.persons = person
      })

    this.socketIoService.
      getPeersList
      .subscribe((peersList: any[]) => {
        peersList.forEach((peer) => {
          peer.on('stream', (stream: MediaStream) => {
            console.log('Got stream from', peer);
            if (!this.sources.includes(stream)) {
              this.sources.push(stream);
            }
          });
        });
      });

    this.initP2p()
  }

  onEndCam(video = false, audio = false) {

  }

  onStartCam() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.isStreaming = true;
      this.socketIoService.addStream(stream);
      this.sources.push(stream);
    })
  }

  initP2p() {
    if (this.isStreaming) {
      this.snackBar.open('You are already streaming !', 'Ok', {
        duration: 2000,
      });
    } else {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            this.isStreaming = true;
            this.socketIoService.addStream(stream);
            this.sources.push(stream);
          })
          .catch(function (err) {
            console.log('Something went wrong!', err);
          });
      }
    }
  }
}
