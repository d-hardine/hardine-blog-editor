import axios from "axios"

//Backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/editor'

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Atau dari state/context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error))

export default api