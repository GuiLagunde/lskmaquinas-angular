export class Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: Sort;
    unpaged: boolean;
    size: number;
  }

  export class Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  }