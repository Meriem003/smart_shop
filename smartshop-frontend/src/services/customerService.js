import api from './api';

const customerService = {
  getAll: async (params = {}) => {
    const { page = 0, size = 10, nom = '', sortBy = 'id', sortDirection = 'ASC' } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    queryParams.append('size', size);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortDirection', sortDirection);
    if (nom) {
      queryParams.append('nom', nom);
    }
    
    const response = await api.get(`/customers?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  update: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  getStats: async (id) => {
    const response = await api.get(`/customers/${id}/stats`);
    return response.data;
  },

  getOrders: async (id) => {
    const response = await api.get(`/customers/${id}/orders`);
    return response.data;
  },
};

export default customerService;
