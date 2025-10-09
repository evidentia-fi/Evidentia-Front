export interface ITableProps<T> {
  data: T[];
  page: number;
  totalPages: number;
  handlePage: (page: number) => void;
}
