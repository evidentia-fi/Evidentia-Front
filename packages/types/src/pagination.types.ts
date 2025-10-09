export interface IPagination {
  num_pages: number;
  page_number: number;
  page_size: number;
  total_results: number;
}

export interface IPaginationProps {
  perPage: number;
  page: number;
}

export interface IPaginationWithFilterProps {
  perPage: number;
  page: number;
  url: string;
}
