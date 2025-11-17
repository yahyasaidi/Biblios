import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

export const bookService = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  initSampleData: async () => {
    const response = await api.post('/init-sample');
    return response.data;
  }
};