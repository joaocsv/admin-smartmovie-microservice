import IUseCase from '../../../shared/application/use-case'
import { NotFoundError } from '../../../shared/domain/errors/not.found.error'
import { Uuid } from '../../../shared/domain/value-object/uuid'
import { Category } from '../../domain/category'
import { ICategoryRepository } from '../../domain/category.repository'

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const category = await this.categoryRepository.find(new Uuid(input.id));
    
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);

    if ("description" in input) {
      category.changeDescription(input.description);
    }

    if (input.isActive === true) {
      category.activate();
    }
    
    if (input.isActive === false) {
      category.deactivate();
    }

    await this.categoryRepository.update(category);

    return {
      id: category.categoryId.value,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.createdAt,
    };
  }
}


export type UpdateCategoryInput = {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateCategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
}