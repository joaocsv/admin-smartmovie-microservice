import { Uuid } from '../../../../shared/domain/value-object/uuid'
import { Category } from '../../../domain/category'
import { CategoryModel } from './category.model'

export class CategoryModelMapper {
  static toEntity (model: CategoryModel): Category {
    const entity = new Category({
      categoryId: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      isActive: model.isActive,
      createdAt: model.createdAt
    })
    Category.validate(entity)
    return entity
  }

  static toModel (entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.categoryId.value,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt
    })
  }
}