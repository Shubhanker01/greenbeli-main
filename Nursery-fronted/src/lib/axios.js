import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5007/api';

const axiosApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosApi;
