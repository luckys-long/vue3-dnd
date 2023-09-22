import {createRouter, createWebHashHistory} from 'vue-router'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import menu from './menu';

export const routes = [
  {
    path: '/',
    redirect: '/drag'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/drag',
    name: 'drag',
    component: () => import('@/views/drag'),
  },

]
// 配置NProgress进度条选项  —— 动画效果
NProgress.configure({ ease: 'ease', speed: 500 });
Object.keys(menu).forEach((k) => {
  routes.push(menu[k]);
});

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // const token = superStorage.get(TOKEN_KEY);
  // if (!token) {
  //   if (to.path.toLocaleLowerCase() !== '/login') {
  //     return next('/login');
  //   }
  // }
  // const { permission } = to.meta;
  // if (permission) {
  //   const perm:any = permission;
  //   const path:string | boolean = await checkRouter(perm[0]);
  //   if (path === true) {
  //     return next();
  //   }
  //   return next(path as string);
  // }
  // if (to.path === '/') {
  //   initRouter();
  // }
  return next();
});

// 全局后置钩子-常用于结束动画等
router.afterEach((to, from) => {
  NProgress.done();
  // do something
})


export default router
