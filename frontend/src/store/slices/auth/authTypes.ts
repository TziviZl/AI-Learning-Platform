export interface User {
  id: number;
  name: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  userNotFound: boolean;
}

export interface UserUpdatePayload {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}
