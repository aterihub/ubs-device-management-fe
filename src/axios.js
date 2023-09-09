import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3333/'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});