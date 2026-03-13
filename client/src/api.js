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
export const userRegister = async (username, email, password) => {
  return apiClient.post('/api/register', { username, email, password });
};

// User Login
export const userLogin = async (emailOrUsername, password) => {
  return apiClient.post('/api/user-login', { emailOrUsername, password });
};

// Favorites
export const getUserFavorites = async (userId, token) => {
  return apiClient.get(`/api/favorites/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addFavorite = async (userId, propertyId, token) => {
  return apiClient.post('/api/favorites', { userId, propertyId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const removeFavorite = async (userId, propertyId, token) => {
  return apiClient.delete(`/api/favorites/${userId}/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default apiClient;
