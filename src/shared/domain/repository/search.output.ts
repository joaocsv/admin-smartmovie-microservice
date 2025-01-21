import { Entity } from "../entity";
import { ValueObject } from '../value.object'

type SearchOutputConstructorProps<E extends Entity> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
};

export class SearchOutput<A extends Entity = Entity> extends ValueObject {
  readonly items: A[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;

  constructor(props: SearchOutputConstructorProps<A>) {
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
      current_page: this.currentPage,
      per_page: this.perPage,
      last_page: this.lastPage,
    };
  }
}