import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { IAuthInterface } from '../contract/auth.interface';

import { Person } from 'src/app/model/person';
import { PersonRepository } from './person-repository.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthInterface {

  private readonly _personRepository: PersonRepository

  constructor(
    private afAuth: AngularFireAuth,
    private personRepository: PersonRepository
  ) { 
this._personRepository = this.personRepository;

  }

  singIn(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(value => {
        this._personRepository.add(value.additionalUserInfo.profile as Person)
        location.reload()
      })
      .catch(err => {
        console.log('Something went wrong: ', err.message);
      });
  }

  singUp(email: string, password: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        this._personRepository.add(value.additionalUserInfo.profile as Person)
        location.reload()
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
  }

  googleSingIn() {
    const provider = new firebase.default.auth.GoogleAuthProvider();

    return this.oAuthLogin(provider)
      .then(value => {
        this._personRepository.add(value.additionalUserInfo.profile as Person)
        location.reload()
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this._personRepository.delete();
      location.reload()
    });
  }

  get getPerson() : Person {

    return this._personRepository.get() as Person;
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider);
  }

}
