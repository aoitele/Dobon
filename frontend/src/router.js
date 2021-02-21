import Vue from "vue";
import Router from "vue-router";
import Top from "./pages/index.vue";
import Room from "./pages/room.vue";

Vue.use(Router);
console.log(process.env.BASE_URL, "process.env.BASE_URL");
export default new Router({
  base: "/",
  mode: "history",
  routes: [
    {
      path: "/",
      name: "top",
      component: Top,
    },
    {
      path: "/room",
      name: "room",
      component: Room,
    },
  ],
});
