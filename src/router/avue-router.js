const router = function () {};
router.install = function ({ router }) {
  this.$router = router;
  this.$router.$avueRouter = {
    safe: this,
    formateRoutes(menus, isFirst) {
      const that = this;
      console.log(menus);
      const arouter = [];
      const modules = import.meta.glob("../views/**/*.vue");

      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        let component = "views" + menu.path;
        const hasChildren = !!menu.children?.length;
        const oRouter = {
          path: menu.path,
          name: menu.name,
          component: () => {
            if (isFirst) {
              return import("../page/index.vue");
            } else if (hasChildren && !isFirst) {
              return import("../page/layout.vue");
            } else {
              const path = `../${component}.vue`;
              if (modules[path]) {
                return modules[path]();
              } else {
                console.error(`Component not found: ${path}`);
              }
            }
          },
          children: !hasChildren
            ? (function () {
                if (isFirst) {
                  const path = menu.path + "/index";
                  const children = [
                    {
                      path: "index",
                      name: menu.name + "index",
                      component: () => {
                        return import(`../${path}.vue`);
                      },
                    },
                  ];
                  return children;
                } else {
                  return [];
                }
              })()
            : (function () {
                return that.formateRoutes(menu.children, false);
              })(),
          redirect: (function () {
            if (isFirst && !hasChildren) {
              return menu.path + "/index";
            } else {
              return "";
            }
          })(),
        };

        arouter.push(oRouter);
      }
      if (isFirst) {
        arouter.forEach((item) => {
          this.safe.$router.addRoute(item);
        });
      } else {
        return arouter;
      }
    },
  };
};
export default router;
