import IUseCase from '../../../shared/application/use-case'
import { Category } from '../../domain/category'
import { ICategoryRepository } from '../../domain/category.repository'

export default class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input);
    await this.categoryRepository.insert(category);
    return {
      id: category.categoryId.value,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.createdAt,
    };
  }
}

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export type CreateCategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
}

