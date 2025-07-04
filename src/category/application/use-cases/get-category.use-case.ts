import IUseCase from '../../../shared/application/use-case'
import { NotFoundError } from '../../../shared/domain/errors/not.found.error'
import { Uuid } from '../../../shared/domain/value-object/uuid'
import { Category } from '../../domain/category'
import { ICategoryRepository } from '../../domain/category.repository'
import { CategoryOutput, CategoryOutputMapper } from '../commom/category-output'

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.find(uuid);
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return CategoryOutputMapper.toOutput(category);
  }

}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;