import { Op } from 'sequelize'
import { NotFoundError } from '../../../../shared/domain/errors/not.found.error'
import { Uuid } from '../../../../shared/domain/value-object/uuid'
import { Category } from '../../../domain/category'
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from '../../../domain/category.repository'
import { CategoryModel } from './category.model'
import { CategoryModelMapper } from './category.model.mapper'

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor (private readonly categoryModel: typeof CategoryModel) {}

  private async _get (id: string) {
    const model = await this.categoryModel.findByPk(id)
    return model
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }
  
  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map(entity => CategoryModelMapper.toModel(entity).toJSON())
    )
  }
  async insert(entity: Category): Promise<void> {
    const modelProps = CategoryModelMapper.toModel(entity)
    await this.categoryModel.create(modelProps.toJSON())
  }

  async update(entity: Category): Promise<void> {
    const id = entity.categoryId.value
    const model = await this._get(id)
    if (!model) {
      throw new NotFoundError(id, this.getEntity())
    }
    const modelProps = CategoryModelMapper.toModel(entity)
    await this.categoryModel.update(modelProps.toJSON(), { where: { category_id: id } })
  }

  async delete(entityId: Uuid): Promise<void> {
    const model = await this._get(entityId.value)
    if (!model) {
      throw new NotFoundError(entityId, this.getEntity())
    }
    this.categoryModel.destroy({ where: { category_id: entityId.value } })
  }
  
  async find(entityId: Uuid): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entityId.value)
    return model && CategoryModelMapper.toEntity(model)
  }

  
  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll()
    return models.map(model => CategoryModelMapper.toEntity(model))
  }

  async search(params: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (params.page - 1) * params.perPage
    const limit = params.perPage

    const {rows: models, count} = await this.categoryModel.findAndCountAll({
      ...(params.filter && { where: { name: { [Op.like]: `%${params.filter}%` } } }),
      ...(params.sort && this.sortableFields.includes(params.sort)
        ? { order: [[params.sort, params.sortDir]] }
        : { order: [['createdAt', 'desc']] }),
      limit,
      offset
    })

    return new CategorySearchResult({
      items: models.map(model => CategoryModelMapper.toEntity(model)),
      total: count,
      perPage: params.perPage,
      currentPage: params.page,
    })
  }
}