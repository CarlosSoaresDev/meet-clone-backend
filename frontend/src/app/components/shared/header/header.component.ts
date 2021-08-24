import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Person } from 'src/app/model/person';
import { AuthService } from 'src/app/services/service/auth.service';
import { SocketioService } from 'src/app/services/service/socketio.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    joinGroupForm: FormGroup;
    isVisible = false;
    person: Person;

    constructor(
        private socketioService: SocketioService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.person = authService.getPerson;
    }

    ngOnInit(): void {

        this.joinGroupForm = this.formBuilder.group({
            call_id: '',
        });

        this.socketioService.setupSocketConnection();
    }

    onCreateHost() {

        if (!this.isCredentials) {
            this.authService.googleSingIn();
            return;
        }

        const hash = this.generateHash();

        this.router.navigate([`/${hash}`])
    }

    onJoinGroup(form: any): void {

        if (!this.isCredentials) {
            this.authService.googleSingIn();
            return;
        }

        this.router.navigate([`/${form.call_id}`])
    }

    onSingIn(): void {
        this.authService.googleSingIn();
    }

    onLongout(): void {
        this.authService.logout()
    }

    onfocus(): void {
        setTimeout(() => {
            document.getElementById('_id').focus();
        }, 10);
    }

    private generateHash(): string {
        return Math.floor(Math.random() * 1000000).toString();
    }

    get isCredentials(): boolean {
        return this.authService.getPerson ? true : false;
    }
}