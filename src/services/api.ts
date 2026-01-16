import axios from 'axios';
import { store } from '../redux/store';

// 1. Base URL
// 1. Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api' || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor (Auth)
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. API Methods

// Auth Types
export interface User {
    _id: string; // Backend uses _id
    id?: string; // Optional alias if needed, but primary is _id
    username?: string;
    email: string;
}

export interface AuthResponse extends User {
    token: string;
}

export const authApi = {
    signup: (data: any) => api.post<AuthResponse>('/auth/signup', data),
    login: (data: any) => api.post<AuthResponse>('/auth/login', data),
};

// Document Types
export interface Document {
    _id: string;
    title: string;
    data: any; // content
    owner?: string | User; // Owner ID or User object
}

export const documentApi = {
    create: (title: string, _id?: string) => api.post<Document>('/documents', { title, _id }),
    get: (id: string) => api.get<Document>(`/documents/${id}`),
    list: () => api.get<Document[]>('/documents'),
    update: (id: string, data: Partial<Document>) => api.put<Document>(`/documents/${id}`, data), // General update (content)
    rename: (id: string, title: string) => api.put<Document>(`/documents/${id}/rename`, { title }), // Specific rename endpoint
    delete: (id: string) => api.delete(`/documents/${id}`),
};

// AI Types (Gemini)
export const aiApi = {
    grammarCheck: (text: string) => api.post('/ai/grammar', { text }),
    summarize: (text: string) => api.post('/ai/summarize', { text }),
};

export default api;
