import { ISearchableRepository } from '../../shared/domain/repository/repository'
import { SearchParameters } from '../../shared/domain/repository/search.parameters'
import { SearchResult } from '../../shared/domain/repository/search.result'
import { Uuid } from '../../shared/domain/value-object/uuid'
import { Category } from './category'

export type CategoryFilter = string;
export class CategorySearchParams extends SearchParameters<CategoryFilter> {}
export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository extends ISearchableRepository<Category, Uuid, CategoryFilter, CategorySearchParams, CategorySearchResult> {}