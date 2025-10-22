// src/api/auth.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    nombre: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

export const authApi = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    return response.data;
  },
};