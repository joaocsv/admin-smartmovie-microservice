import { Uuid } from '../../../../../shared/domain/value-object/uuid'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'
import { CategoryModel } from '../../../../infra/db/sequelize/category.model'
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category.sequelize.repository'
import CreateCategoryUseCase from '../../create-category.use-case'

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  it("should create a category", async () => {
    let output = await useCase.execute({ name: "test" });
    let entity = await repository.find(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: "test",
      description: null,
      is_active: true,
      created_at: entity.createdAt,
    });

    output = await useCase.execute({
      name: "test",
      description: "some description",
    });
    entity = await repository.find(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: "test",
      description: "some description",
      is_active: true,
      created_at: entity.createdAt,
    });

    output = await useCase.execute({
      name: "test",
      description: "some description",
      isActive: true,
    });
    entity = await repository.find(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: "test",
      description: "some description",
      is_active: true,
      created_at: entity.createdAt,
    });

    output = await useCase.execute({
      name: "test",
      description: "some description",
      isActive: false,
    });
    entity = await repository.find(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: "test",
      description: "some description",
      is_active: false,
      created_at: entity.createdAt,
    });
  });
});