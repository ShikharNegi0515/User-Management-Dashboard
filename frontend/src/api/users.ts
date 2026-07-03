import axios from 'axios';
import { API_BASE_URL } from '../config';
import type {
  PaginatedUsersResponse,
  User,
  UserFormData,
  UsersQueryParams,
} from '../types/user';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchUsers(
  params: UsersQueryParams,
): Promise<PaginatedUsersResponse> {
  const { page, limit, search, sortBy, sortOrder, filters } = params;
  const response = await api.get<PaginatedUsersResponse>('/users', {
    params: {
      page,
      limit,
      search: search || undefined,
      sortBy,
      sortOrder,
      firstName: filters.firstName || undefined,
      lastName: filters.lastName || undefined,
      email: filters.email || undefined,
      department: filters.department || undefined,
    },
  });
  return response.data;
}

export async function fetchUser(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(data: UserFormData): Promise<User> {
  const response = await api.post<User>('/users', data);
  return response.data;
}

export async function updateUser(
  id: number,
  data: UserFormData,
): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    if (error.response?.status === 404) return 'User not found';
    if (error.response?.status === 502) return 'External API is unavailable';
    if (!error.response) return 'Network error. Please check your connection.';
    return 'Something went wrong. Please try again.';
  }
  return 'An unexpected error occurred';
}
