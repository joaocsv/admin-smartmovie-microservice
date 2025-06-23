import IUseCase from '../../../shared/application/use-case'
import { NotFoundError } from '../../../shared/domain/errors/not.found.error'
import { Uuid } from '../../../shared/domain/value-object/uuid'
import { Category } from '../../domain/category'
import { ICategoryRepository } from '../../domain/category.repository'

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.find(uuid);
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return {
      id: category.categoryId.value,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.createdAt
    };
  }

}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
};