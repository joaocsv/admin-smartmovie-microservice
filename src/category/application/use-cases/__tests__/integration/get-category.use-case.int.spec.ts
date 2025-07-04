import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error'
import { Uuid } from '../../../../../shared/domain/value-object/uuid'
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from '../../../../domain/category'
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category.sequelize.repository'
import { GetCategoryUseCase } from "../../get-category.use-case";

describe("GetCategoryUseCase Integration Tests", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.value })).rejects.toThrow(
      new NotFoundError(uuid.value, Category)
    );
  });

  it("should returns a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const output = await useCase.execute({ id: category.categoryId.value });
    expect(output).toStrictEqual({
      id: category.categoryId.value,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  });
});