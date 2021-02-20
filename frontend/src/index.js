import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 開発環境でtrueにしておくと開発向けメッセージが多くでる
// Vue.config.productionTip = false;

new Vue({
  router,
  el: "#app",
  render: (h) => h(App),
});
