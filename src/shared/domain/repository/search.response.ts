import { Entity } from "../entity";
import { ValueObject } from '../value.object'

type SearchResponseConstructorProps<E extends Entity> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
};

export class SearchResponse<A extends Entity = Entity> extends ValueObject {
  readonly items: A[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;

  constructor(props: SearchResponseConstructorProps<A>) {
    super();
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity
        ? this.items.map((item) => item.toJSON())
        : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
    };
  }
}