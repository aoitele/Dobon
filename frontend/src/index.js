import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "regenerator-runtime/runtime";

// 開発環境でtrueにしておくと開発向けメッセージが多くでる
Vue.config.productionTip = true;
Vue.prototype.$axios = axios;

new Vue({
  router,
  el: "#app",
  render: (h) => h(App),
});
