export interface Search<E> {
  data: E[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}
