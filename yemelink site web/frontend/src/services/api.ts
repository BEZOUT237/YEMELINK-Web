import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Services
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.post('/auth/change-password', data),
};

export const projectsApi = {
  getAll: (page: number = 1) => api.get(`/projects?page=${page}`),
  getFeatured: () => api.get('/projects/featured'),
  getOne: (slug: string) => api.get(`/projects/${slug}`),
};

export const servicesApi = {
  getAll: () => api.get('/services'),
  getOne: (slug: string) => api.get(`/services/${slug}`),
  getByCategory: (category: string) => api.get(`/services/category/${category}`),
};

export const articlesApi = {
  getAll: (page: number = 1) => api.get(`/articles?page=${page}`),
  getFeatured: () => api.get('/articles/featured'),
  getOne: (slug: string) => api.get(`/articles/${slug}`),
  search: (query: string) => api.get(`/articles/search/${query}`),
};

export const postsApi = {
  getAll: (page: number = 1) => api.get(`/posts?page=${page}`),
  create: (data: any) => api.post('/posts', data),
  like: (postId: number) => api.post(`/posts/${postId}/like`),
  delete: (postId: number) => api.delete(`/posts/${postId}`),
  addComment: (postId: number, content: string) =>
    api.post(`/posts/${postId}/comments`, { content }),
};

export const contactApi = {
  sendMessage: (data: any) => api.post('/contact/message', data),
  requestQuote: (data: any) => api.post('/contact/quote', data),
};

export const chatApi = {
  sendMessage: (message: string, session_id?: string) =>
    api.post('/chat/message', { message, session_id }),
  getHistory: (session_id: string) => api.get(`/chat/history/${session_id}`),
  getSessions: () => api.get('/chat/sessions'),
};

export const paymentsApi = {
  createCheckout: (plan: string) => api.post('/payments/create-checkout', { plan }),
  getSubscription: () => api.get('/payments/subscription'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId: number, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deletePost: (postId: number) => api.delete(`/admin/posts/${postId}`),
  pinPost: (postId: number, pin: boolean) =>
    api.patch(`/admin/posts/${postId}/pin`, { pin }),
  createArticle: (data: any) => api.post('/admin/articles', data),
  updateArticle: (articleId: number, data: any) =>
    api.put(`/admin/articles/${articleId}`, data),
  deleteArticle: (articleId: number) => api.delete(`/admin/articles/${articleId}`),
  getReports: () => api.get('/admin/reports'),
};
