import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EventEmmitService {

    isFullScreen = new EventEmitter<boolean>()

    constructor(
    ) { }

    enableFullScree(enable: boolean) {
        this.isFullScreen.emit(enable);  
    }
}
