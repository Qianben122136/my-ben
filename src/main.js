// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.css'
import axios from 'axios'
Vue.use(ElementUI)
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
Vue.prototype.$axios = axios
Vue.config.productionTip = false
axios.interceptors.request.use(
  function(config) {
    // 发送请求之前做什么
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    if (response.data.meta.status === 401) {
      router.push('/login')
      localStorage.removeItem('token')
    }
    // Do something with response data
    return response
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
