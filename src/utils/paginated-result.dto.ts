export class PaginatedResultDto<T> {
  data: T[];
  total_rows: number;
  current: number;
  page_size: number;
}
