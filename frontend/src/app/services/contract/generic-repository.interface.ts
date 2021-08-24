export interface IGenericRepositoryService<Entity> {

    getAll(entity: Entity): Entity[];

    get(entity: Entity): Entity;

    add(entity: Entity): void;

    update(entity: Entity): void;

    delete(entity: Entity): void;
}