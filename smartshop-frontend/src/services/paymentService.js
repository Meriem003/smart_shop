import api from './api';

const paymentService = {
  getAll: async (params = {}) => {
    const { page = 0, size = 10 } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    queryParams.append('size', size);
    
    const response = await api.get(`/payments?${queryParams.toString()}`);
    return response.data;
  },

  createEspeces: async (paymentData) => {
    const response = await api.post('/payments/especes', paymentData);
    return response.data;
  },

  createCheque: async (paymentData) => {
    const response = await api.post('/payments/cheque', paymentData);
    return response.data;
  },

  createVirement: async (paymentData) => {
    const response = await api.post('/payments/virement', paymentData);
    return response.data;
  },
};

export default paymentService;
