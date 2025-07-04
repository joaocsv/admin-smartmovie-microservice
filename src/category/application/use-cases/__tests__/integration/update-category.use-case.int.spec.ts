import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error'
import { Uuid } from '../../../../../shared/domain/value-object/uuid'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Category } from '../../../../domain/category'
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category.sequelize.repository'
import { UpdateCategoryUseCase } from '../../update-category.use-case';

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() =>
      useCase.execute({ id: uuid.value, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.value, Category));
  });

  it('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.categoryId.value,
      name: 'test',
    });
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: 'test',
      description: entity.description,
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
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
          isActive: false,
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
          isActive: true,
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
          description: null,
          isActive: false,
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: null,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...(i.input.name && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('isActive' in i.input && { isActive: i.input.isActive }),
      });
      const entityUpdated = await repository.find(new Uuid(i.input.id));
      expect(output).toStrictEqual({
        id: entity.categoryId.value,
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: entityUpdated.createdAt,
      });
      expect(entityUpdated.toJSON()).toStrictEqual({
        categoryId: entity.categoryId.value,
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: entityUpdated.createdAt,
      });
    }
  });
});