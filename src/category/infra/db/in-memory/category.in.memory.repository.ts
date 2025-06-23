import { InMemorySearchableRepository } from '../../../../shared/domain/repository/in-memory/in.memory.repository'
import { SortDirection } from '../../../../shared/domain/repository/search.parameters'
import { Uuid } from '../../../../shared/domain/value-object/uuid'
import { Category } from '../../../domain/category'

export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category, Uuid> {
  sortableFields: string[] = ['name', 'createdAt'];

  protected async applyFilter(items: Category[], filter: string): Promise<Category[]> {
    if (!filter) { return items; }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return  Category;
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "createdAt", "desc");
  }
}