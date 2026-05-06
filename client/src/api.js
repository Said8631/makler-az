import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Admin Login
export const adminLogin = async (username, password) => {
  return apiClient.post('/api/login', { username, password });
};

// Properties
export const getProperties = async () => {
  return apiClient.get('/api/properties');
};

export const addProperty = async (formData, token) => {
  return apiClient.post('/api/properties', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const editProperty = async (id, formData, token) => {
  return apiClient.put(`/api/properties/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteProperty = async (id, token) => {
  return apiClient.delete(`/api/properties/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// User Registration
export const userRegister = async (username, password) => {
  return apiClient.post('/api/register', { username, password });
};

// User Login
export const userLogin = async (username, password) => {
  return apiClient.post('/api/user/login', { username, password });
};

// Favorites
export const getUserFavorites = async (token) => {
  return apiClient.get('/api/user/favorites', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addFavorite = async (propertyId, token) => {
  return apiClient.post('/api/user/favorites', { property_id: propertyId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const removeFavorite = async (propertyId, token) => {
  return apiClient.delete(`/api/user/favorites/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default apiClient;
