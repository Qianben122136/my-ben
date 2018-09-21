import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      component: Home,
      children: [{ path: 'users', component: Users }]
    },
    { path: '/login', component: Login }
  ]
})
// 全局导航守卫
// 用router.beforeEach方法老实现登录拦截
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('./login')
    }
  }
})

export default router
