import axios from "axios";

axios.defaults.baseURL = process.env.API_BASE_URL;
console.log(axios.defaults.baseURL, 'axios.defaults.baseURL');

axios.defaults.baseURL = process.env.API_BASE_URL_TEST;
console.log(axios.defaults.baseURL, 'axios.defaults.baseURLTEST');

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export { axios }
