import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error'
import { InvalidUuidError, Uuid } from '../../../../../shared/domain/value-object/uuid'
import { Category } from '../../../../domain/category'
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category.in.memory.repository'
import { DeleteCategoryUseCase } from "../../delete-category.use-case";

describe("DeleteCategoryUseCase Unit Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id"})
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.value})
    ).rejects.toThrow(new NotFoundError(uuid.value, Category));
  });

  it("should delete a category", async () => {
    const items = [new Category({ name: "test 1" })];
    repository.entities = items;
    await useCase.execute({
      id: items[0].categoryId.value,
    });
    expect(repository.entities).toHaveLength(0);
  });
});