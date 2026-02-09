import api from './api';

const promoCodeService = {
  getAll: async (params = {}) => {
    const { page = 0, size = 10 } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    queryParams.append('size', size);
    
    const response = await api.get(`/promo-codes?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/promo-codes/${id}`);
    return response.data;
  },

  create: async (promoCodeData) => {
    const response = await api.post('/promo-codes', promoCodeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/promo-codes/${id}`);
    return response.data;
  },

  getByCode: async (code) => {
    const response = await api.get(`/promo-codes/code/${code}`);
    return response.data;
  },
};

export default promoCodeService;
