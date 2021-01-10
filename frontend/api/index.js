import axios from "axios";

const axios = () => {
  return axios.create({
    baseURL: `http://localhost:3000/`
  });
};

export { axios };
