export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserFilters {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export type SortField = 'id' | 'firstName' | 'lastName' | 'email' | 'department';
export type SortOrder = 'asc' | 'desc';

export interface UsersQueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  filters: UserFilters;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
}
