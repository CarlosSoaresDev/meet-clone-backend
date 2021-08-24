import { Component, OnInit } from '@angular/core';
import { EventEmmitService } from './Common/event-emmit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isFullScree: boolean = false;

  constructor(
    private eventEmmitService: EventEmmitService
  ) { }

  ngOnInit(): void {

    this.eventEmmitService.isFullScreen.subscribe((event) => {
      this.isFullScree = event
    })
  }
}
