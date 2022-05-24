import axios from 'axios';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  validateStatus: status => status >= 200 && status < 300,
  headers: {
    Authorization: '',
  },
});

export default http;
