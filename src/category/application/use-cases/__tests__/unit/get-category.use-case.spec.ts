import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error'
import { InvalidUuidError, Uuid } from '../../../../../shared/domain/value-object/uuid'
import { Category } from '../../../../domain/category'
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category.in.memory.repository'
import { GetCategoryUseCase } from "../../get-category.use-case";

describe("GetCategoryUseCase Unit Tests", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError()
    );

    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.value })).rejects.toThrow(
      new NotFoundError(uuid.value, Category)
    );
  });

  it("should returns a category", async () => {
    const items = [Category.create({ name: "Movie" })];
    repository.entities = items;
    const spyFindById = jest.spyOn(repository, "find");
    const output = await useCase.execute({ id: items[0].categoryId.value });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].categoryId.value,
      name: "Movie",
      description: null,
      isActive: true,
      createdAt: items[0].createdAt,
    });
  });
});