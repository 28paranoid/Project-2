import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

// We will use a variable to store the token since we don't use localStorage
let authToken = null;

export const setClientToken = (token) => {
  authToken = token;
};

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default apiClient;
