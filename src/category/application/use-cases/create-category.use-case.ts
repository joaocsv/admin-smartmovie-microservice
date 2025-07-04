import IUseCase from '../../../shared/application/use-case'
import { Category } from '../../domain/category'
import { ICategoryRepository } from '../../domain/category.repository'
import { CategoryOutput, CategoryOutputMapper } from '../commom/category-output'

export default class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input);
    await this.categoryRepository.insert(category);
    return CategoryOutputMapper.toOutput(category);
  }
}

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export type CreateCategoryOutput = CategoryOutput;

