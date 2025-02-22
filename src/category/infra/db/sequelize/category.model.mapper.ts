import { UuidValueObject } from '../../../../shared/domain/value-object/uuid.value.object'
import { Category } from '../../../domain/category'
import { CategoryModel } from './category.model'

export class CategoryModelMapper {
  static toEntity (model: CategoryModel): Category {
    const entity = new Category({
      categoryId: new UuidValueObject(model.category_id),
      name: model.name,
      description: model.description,
      isActive: model.is_active,
      createdAt: model.created_at
    })
    Category.validate(entity)
    return entity
  }

  static toModel (entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.categoryId.value,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
      created_at: entity.createdAt
    })
  }
}