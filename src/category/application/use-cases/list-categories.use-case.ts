import { SortDirection } from '../../../shared/domain/repository/search.parameters'
import { CategoryFilter, CategorySearchParams, CategorySearchResult, ICategoryRepository } from '../../domain/category.repository'
import { PaginationOutput, PaginationOutputMapper } from '../../../shared/application/pagination-output'
import { CategoryOutput, CategoryOutputMapper } from '../commom/category-output'
import IUseCase from '../../../shared/application/use-case'

export class ListCategoriesUseCase implements IUseCase<ListCategoriesInput, ListCategoriesOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.categoryRepository.search(params);    
    return this.toOutput(searchResult);
  }

  private toOutput (searchResult: CategorySearchResult): ListCategoriesOutput {
    const { items: _items } = searchResult;
    const items = _items.map((i) => { return CategoryOutputMapper.toOutput(i)});
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListCategoriesInput = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: CategoryFilter | null;
}

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;