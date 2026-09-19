import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
});

export default api;