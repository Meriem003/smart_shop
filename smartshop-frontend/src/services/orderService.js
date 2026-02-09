import api from './api';

const orderService = {
  getAll: async (params = {}) => {
    const { page = 0, size = 10, status = '', customerId = '' } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    queryParams.append('size', size);
    if (status) {
      queryParams.append('status', status);
    }
    if (customerId) {
      queryParams.append('customerId', customerId);
    }
    
    const response = await api.get(`/orders?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  confirm: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/confirm`);
    return response.data;
  },

  cancel: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },
};

export default orderService;
