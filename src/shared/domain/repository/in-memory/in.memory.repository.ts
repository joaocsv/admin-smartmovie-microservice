import { Entity } from '../../entity'
import { NotFoundError } from '../../errors/not.found.error'
import { ValueObject } from '../../value.object'
import { IRepository, ISearchableRepository } from '../repository'
import { SearchParameters, SortDirection } from '../search.parameters'
import { SearchResult } from '../search.result'

export abstract class InMemoryRepository <E extends Entity, EntityId extends ValueObject> implements IRepository <E, EntityId> {
  entities: E[] = []

  abstract getEntity(): new (...args: any[]) => E 

  async bulkInsert(entities: E[]): Promise<void> {
    this.entities.push(...entities)
  }

  async insert(entity: E): Promise<void> {
    this.entities.push(entity)
  }

  async update(entity: E): Promise<void> {
    const index = this.entities.findIndex((e) => e.entityId.equals(entity.entityId))

    if (index === -1) {
      throw new NotFoundError(entity.entityId, this.getEntity())
    }

    this.entities[index] = entity
  }

  async delete(entityId: EntityId): Promise<void> {
    const index = this.entities.findIndex((e) => e.entityId.equals(entityId))

    if (index === -1) {
      throw new NotFoundError(entityId, this.getEntity())
    }

    this.entities.splice(index, 1)
  }

  async find(entityId: any): Promise<any | null> {
    return this.entities.find((e) => e.entityId.equals(entityId)) || null
  }

  async findAll(): Promise<E[]> {
    return this.entities;
  }
}

export abstract class InMemorySearchableRepository<E extends Entity, EntityId extends ValueObject, Filter = string> extends InMemoryRepository<E, EntityId> implements ISearchableRepository<E, EntityId, Filter> {
  abstract sortableFields: string[]

  async search(input: SearchParameters<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.entities, input.filter);
    const itemsSorted = this.applySort(itemsFiltered, input.sort, input.sortDir);
    const itemsPaginated = this.applyPaginate(itemsSorted, input.page, input.perPage);
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: input.page,
      perPage: input.perPage,
    });
  }

  protected abstract applyFilter(items: E[], filter: Filter | null): Promise<E[]>;
  protected applyPaginate(items: E[], page: SearchParameters["page"], perPage: SearchParameters["perPage"]): E[] {
    const start = (page - 1) * perPage;
    const limit = start + perPage;
    return items.slice(start, limit);
  }
  protected applySort(items: E[], sort: string | null, sortDir: SortDirection | null, custom_getter?: (sort: string, item: E) => any) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }
    return [...items].sort((a, b) => {
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort];
      if (aValue > bValue) {
        return sortDir === "asc" ? 1 : -1;
      }
      if (aValue < bValue) {
        return sortDir === "asc" ? -1 : 1;
      }
      return 0;
    })
  }
}