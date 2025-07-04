import { Category } from '../../domain/category'

export type CategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
}

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    const { categoryId, ...otherProperties }  = entity.toJSON();
    return {
      id: entity.categoryId.value,
      ...otherProperties
    };
  }
}