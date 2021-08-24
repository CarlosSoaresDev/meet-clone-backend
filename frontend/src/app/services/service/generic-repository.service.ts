import { Injectable } from '@angular/core';
import { IGenericRepositoryService } from '../contract/generic-repository.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class GenericRepositoryService<Entity> implements IGenericRepositoryService<Entity> {

  private readonly _storag = localStorage;
  private _table: string;

  constructor(table: string) {
    this._table = table
  }

  getAll(): Entity[] {
    return JSON.parse(this._storag.getItem(this._table)) || null;
  }

  get(): Entity {
    return JSON.parse(this._storag.getItem(this._table)) || null;
  }

  add(entity: Entity): void {
    console.log(this._table)
    this._storag.setItem(this._table, JSON.stringify(entity));
  }

  update(entity: Entity): void {
    this._storag.setItem(this._table, JSON.stringify(entity));
  }

  delete(): void {
    this._storag.removeItem(this._table);
  }
}

