import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'http://localhost:5007/api', // Replace with your backend URL
    withCredentials: true, // <-- THIS ALLOWS COOKIES TO BE SENT AND SAVED
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosApi;