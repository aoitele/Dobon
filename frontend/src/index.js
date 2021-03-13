import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "regenerator-runtime/runtime";
import { axios } from "./api.js";

// 開発環境でtrueにしておくと開発向けメッセージが多くでる
Vue.config.productionTip = true;
Vue.prototype.$axios = axios;

new Vue({
  router,
  el: "#app",
  render: (h) => h(App),
});
