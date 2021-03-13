import axios from "axios";

axios.defaults.baseURL = process.env.API_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export { axios }
