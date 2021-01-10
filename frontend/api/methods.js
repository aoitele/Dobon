import api from "./index";

const methods = {
  init: () => {
    return api.get("./mydb");
  }
};

export { methods };
