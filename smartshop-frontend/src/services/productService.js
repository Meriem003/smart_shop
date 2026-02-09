import api from './api';

const productService = {
  getAll: async (params = {}) => {
    const { page = 0, size = 10, search = '', minPrice, maxPrice, sortBy = 'id', sortDirection = 'ASC' } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    queryParams.append('size', size);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortDirection', sortDirection);
    if (search) {
      queryParams.append('nom', search);
    }
    if (minPrice !== undefined && minPrice !== '') {
      queryParams.append('minPrice', minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      queryParams.append('maxPrice', maxPrice);
    }
    
    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
