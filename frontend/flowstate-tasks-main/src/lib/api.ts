import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  token: string;
  role: "admin" | "user";
}



export interface Task {
  id: string;
  title: string;
  userId: string;
  userName?: string;
  createdAt: string;
}
export interface User {
  role: "admin" | "user";
}


export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface LoginData {
  email: string;
  password: string;
}

// Auth API
export const authApi = {
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/api/auth/register', data),
  
  login: (data: LoginData) => 
    api.post<AuthResponse>('/api/auth/login', data),
};

// Tasks API
export const tasksApi = {
  getAll: () => 
    api.get<Task[]>('/api/tasks'),
  
  create: (title: string) => 
    api.post<Task>('/api/tasks', { title }),
  
  delete: (id: string) => 
    api.delete(`/api/tasks/${id}`),
};

export default api;
