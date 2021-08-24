import { Injectable } from '@angular/core';
import { Person } from 'src/app/model/person';
import { GenericRepositoryService } from './generic-repository.service';

@Injectable({
  providedIn: 'root'
})
export class PersonRepository extends GenericRepositoryService<Person> {

  constructor() {
    super(Person.name);
  }

}
