
import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error'
import { InvalidUuidError, Uuid } from '../../../../../shared/domain/value-object/uuid'
import { Category } from '../../../../domain/category'
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category.in.memory.repository'
import { UpdateCategoryUseCase } from "../../update-category.use-case";

describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id", name: "fake" })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.value, name: "fake" })
    ).rejects.toThrow(new NotFoundError(uuid.value, Category));
  });

  it("should update a category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new Category({ name: "Movie" });
    repository.entities = [entity];

    let output = await useCase.execute({
      id: entity.categoryId.value,
      name: "test",
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: "test",
      description: null,
      isActive: true,
      createdAt: entity.createdAt,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        isActive?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        isActive: boolean;
        createdAt: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
        },
        expected: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: "test",
        },
        expected: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: "test",
          isActive: false,
        },
        expected: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: "test",
        },
        expected: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: "test",
          isActive: true,
        },
        expected: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
          isActive: false,
        },
        expected: {
          id: entity.categoryId.value,
          name: "test",
          description: "some description",
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...("name" in i.input && { name: i.input.name }),
        ...("description" in i.input && { description: i.input.description }),
        ...("isActive" in i.input && { isActive: i.input.isActive }),
      });
      expect(output).toStrictEqual({
        id: entity.categoryId.value,
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: i.expected.createdAt,
      });
    }
  });
});