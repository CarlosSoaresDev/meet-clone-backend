import { ElementRef, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-tile',
  templateUrl: './video-tile.component.html',
  styleUrls: ['./video-tile.component.scss'],
})
export class VideoTileComponent implements OnInit {

  @Input() sourceObj: MediaStream;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    const video = this.elementRef.nativeElement.querySelector(
      'video'
    );

    video.srcObject = this.sourceObj;
    video.muted = true
    video.controls = true
    video.loop = true
  }
}
