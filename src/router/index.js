import HelloWorld from "@/components/HelloWorld.vue";
import { createWebHistory, createRouter as _createRouter } from "vue-router";
import { getPeriodMenu } from "@/api";
import HomeView from "../page/index.vue";
import avueRouter from "./avue-router";
const pageRoutes = [{ path: "/", component: HomeView }];

export async function createRouter() {
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

  avueRouter.install({
    router,
  });
  const res = await getPeriodMenu();
  router.$avueRouter.formateRoutes(res.data, true);
  console.log(router.$avueRouter.safe.$router.getRoutes());
  return router;
}
