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

export interface JsonPlaceholderUser {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}
