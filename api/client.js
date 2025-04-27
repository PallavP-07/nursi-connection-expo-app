import axios from 'axios';

const api = axios.create({
  baseURL: "https://nursi.webiknows.in/api",
});

export default api;
