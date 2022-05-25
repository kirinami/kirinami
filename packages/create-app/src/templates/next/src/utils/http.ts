import axios from 'axios';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  validateStatus: (status) => status >= 200 && status < 300,
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUzNDY3MTg2LCJleHAiOjE2NTQwNzE5ODZ9.K_WzbUMxTRxrC18vDrPWBmwiYSnZgoFW3Zx-TbYEFHA',
  },
});

export default http;
