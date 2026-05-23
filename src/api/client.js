import axios from 'axios';

const BASE = 'https://cletaeats-backend-production-984f.up.railway.app/api';

const client = axios.create({ baseURL: BASE });

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ce_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

client.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data?.error || 'Error de conexión')
);

export const authApi = {
  login: (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
};

export const crudApi = {
  getAll: (section, params) => client.get(`/${section}`, { params }),
  getById: (section, id) => client.get(`/${section}/${id}`),
  create: (section, data) => client.post(`/${section}`, data),
  update: (section, id, data) => client.put(`/${section}/${id}`, data),
  delete: (section, id) => client.delete(`/${section}/${id}`),
};
