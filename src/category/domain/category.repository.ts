import { ISearchableRepository } from '../../shared/domain/repository/repository'
import { SearchParameters } from '../../shared/domain/repository/search.parameters'
import { SearchResponse } from '../../shared/domain/repository/search.response'
import { Uuid } from '../../shared/domain/value-object/uuid'
import { Category } from './category'

export type CategoryFilter = string;
export class CategorySearchParams extends SearchParameters<CategoryFilter> {}
export class CategorySearchResult extends SearchResponse<Category> {}

export interface ICategoryRepository extends ISearchableRepository<Category, Uuid, CategoryFilter, CategorySearchParams, CategorySearchResult> {}