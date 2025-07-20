export interface User {
  id: number;
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin' | '';
  search?: string;
}
