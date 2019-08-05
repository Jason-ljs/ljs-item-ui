// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//引入定义的全局变量
import gloable from './store/gloable'
//存入全局备用
Vue.prototype.domain=gloable

//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//引入axios
import axios from 'axios'
Vue.prototype.$axios=axios

//允许携带cookie
axios.defaults.withCredentials=true

//引入cookie插件
import Cookies from 'js-cookie'
Vue.prototype.Cookie=Cookies

//引入VUEX
import store from './store/store'

//自己导入的小图片
import './assets/font/iconfont.css'
import './assets/xiaotubiao/iconfont.css'

//路由拦截
router.beforeEach((to,from,next) => {
  next()
})

//请求拦截器
axios.interceptors.request.use((config) => {
  if(config.url.includes("getCode")){//如果是获取验证码的路径
    //没有cookie的话添加cookie
    let aucokie = Cookies.get("authcode")
    if(aucokie==null){
      Cookies.set("authcode","",{path:"/",domain:"localhost",age:-1})
    }
  }
  config.headers.setItem("token","")
  return config;
})
axios.interceptors.response.use((config) => {
  if(config.url.includes("getCode")){//如果是获取验证码的路径
    //没有cookie的话添加cookie
    let aucokie = Cookies.get("authcode")
    if(aucokie==null){
      Cookies.set("authcode","",{path:"/",domain:"localhost",age:-1})
    }
  }
  config.headers.setItem("token","")
  return config;
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
