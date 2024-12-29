import HelloWorld from "@/components/HelloWorld.vue";
import { createWebHistory, createRouter as _createRouter } from "vue-router";

import HomeView from "../page/index.vue";

const pageRoutes = [{ path: "/", component: HomeView }];

export function createRouter() {
  const router = _createRouter({
    history: createWebHistory(),
    routes: [
      ...pageRoutes,
      {
        path: "/join",
        component: HomeView,
        children: [{ path: "hello", component: HelloWorld }],
      },
    ],
  });
  return router;
}
