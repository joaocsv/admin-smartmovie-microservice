import { Entity } from '../../../entity'
import { NotFoundError } from '../../../errors/not.found.error'
import { UuidValueObject } from '../../../value-object/uuid.value.object'
import { InMemoryRepository } from '../in.memory.repository'

type StubEntityConstructor = {
  entity_id?: UuidValueObject;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entityId: UuidValueObject;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entityId = props.entity_id || new UuidValueObject();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entityId.toString(),
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, UuidValueObject> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test("should insert a new entity", async () => {
    const entity = new StubEntity({
      entity_id: new UuidValueObject(),
      name: "Test",
      price: 100,
    });

    await repo.insert(entity);

    expect(repo.entities.length).toBe(1);
    expect(repo.entities[0]).toBe(entity);
  });

  test("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entity_id: new UuidValueObject(),
        name: "Test",
        price: 100,
      }),
      new StubEntity({
        entity_id: new UuidValueObject(),
        name: "Test",
        price: 100,
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.entities.length).toBe(2);
    expect(repo.entities[0]).toBe(entities[0]);
    expect(repo.entities[1]).toBe(entities[1]);
  });

  it("should returns all entities", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repo.insert(entity);

    const entities = await repo.findAll();

    expect(entities).toStrictEqual([entity]);
  });

  it("should throws error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity)
    );
  });

  it("should updates an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repo.insert(entity);

    const entityUpdated = new StubEntity({
      entity_id: entity.entityId,
      name: "updated",
      price: 1,
    });
    await repo.update(entityUpdated);
    expect(entityUpdated.toJSON()).toStrictEqual(repo.entities[0].toJSON());
  });

  it("should throws error on delete when entity not found", async () => {
    const uuid = new UuidValueObject();
    await expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.value, StubEntity)
    );

    await expect(
      repo.delete(new UuidValueObject("9366b7dc-2d71-4799-b91c-c64adb205104"))
    ).rejects.toThrow(
      new NotFoundError("9366b7dc-2d71-4799-b91c-c64adb205104", StubEntity)
    );
  });

  it("should deletes an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repo.insert(entity);

    await repo.delete(entity.entityId);
    expect(repo.entities).toHaveLength(0);
  });
});