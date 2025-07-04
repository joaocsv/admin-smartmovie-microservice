import { Entity } from '../entity'
import { ValueObject } from '../value.object'
import { SearchParameters } from './search.parameters'
import { SearchResult } from './search.result'

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  getEntity (): new (...args: any[]) => E
  bulkInsert(entities: E[]): Promise<void>
  insert(entity: E): Promise<void>
  update(entity: E): Promise<void>
  delete(entityId: EntityId): Promise<void>
  find(entityId: EntityId): Promise<E | null>
  findAll(): Promise<E[]>
}

export interface ISearchableRepository<E extends Entity, EntityId extends ValueObject, Filter = string, SearchInput = SearchParameters<Filter>, SearchOutput = SearchResult> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(input: SearchInput): Promise<SearchOutput>
}