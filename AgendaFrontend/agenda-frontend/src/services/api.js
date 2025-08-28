import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contatoService = {
  async getAll() {
    const response = await api.get('/contatos');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/contatos/${id}`);
    return response.data;
  },

  async create(contato) {
    const response = await api.post('/contatos', contato);
    return response.data;
  },

  async update(id, contato) {
    const response = await api.put(`/contatos/${id}`, contato);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/contatos/${id}`);
  }
};

export default api;