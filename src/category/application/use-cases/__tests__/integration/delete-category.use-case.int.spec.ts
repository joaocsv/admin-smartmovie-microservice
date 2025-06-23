import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error'
import { Uuid } from '../../../../../shared/domain/value-object/uuid'
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from '../../../../domain/category'
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category.sequelize.repository'
import { DeleteCategoryUseCase } from "../../delete-category.use-case";

describe("DeleteCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.value })).rejects.toThrow(
      new NotFoundError(uuid.value, Category)
    );
  });

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await useCase.execute({
      id: category.categoryId.value,
    });
    await expect(repository.find(category.categoryId)).resolves.toBeNull();
  });
});