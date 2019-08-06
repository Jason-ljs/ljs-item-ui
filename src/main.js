// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//引入定义的全局变量
import gloable from './store/gloable'
//存入全局备用
Vue.prototype.domain = gloable

//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

//引入axios
import axios from 'axios'

Vue.prototype.$axios = axios

//允许携带cookie
axios.defaults.withCredentials = true

//引入cookie插件
import Cookies from 'js-cookie'

Vue.prototype.Cookies = Cookies

//引入VUEX
import store from './store/store'

//自己导入的小图片
import './assets/font/iconfont.css'
import './assets/xiaotubiao/iconfont.css'

//音频文件的使用
import yiliuyan from '../static/tishiyin/yiliuyan.mp3'
import aiya from '../static/tishiyin/aiya.mp3'
import en from '../static/tishiyin/en.mp3'
import tishiyin from '../static/tishiyin/tishiyin.mp3'
import dahuaxiyou from '../static/tishiyin/dahuaxiyou.mp3'

Vue.prototype.playAudio = (id, yinyue) => {
  let buttonAudio = document.getElementById(id);
  if (yinyue == "yiliuyan") {
    buttonAudio.setAttribute('src', yiliuyan)
  }
  if (yinyue == "en") {
    buttonAudio.setAttribute('src', en)
  }
  if (yinyue == "aiya") {
    buttonAudio.setAttribute('src', aiya)
  }
  if (yinyue == "tishiyin") {
    buttonAudio.setAttribute('src', tishiyin)
  }
  if (yinyue == "dahuaxiyou") {
    buttonAudio.setAttribute('src', dahuaxiyou)
  }
  buttonAudio.play()
}

//路由拦截
router.beforeEach((to, from, next) => {
  //判断是否登录 to.meta.require是true说明需要进行登录的验证
  if(to.meta.require){
    //获取本地存储中的jwt token
    let token=window.sessionStorage.getItem("token");
    if(token!=null){
      next();
    }else{
      next({path:"/"});//跳转到登录页面
    }
  }else{
    //否则说明不需要进行登录的验证
    next();
  }
})

//请求拦截器
axios.interceptors.request.use((config) => {
  if (config.url.includes("getCode")) {//如果是获取验证码的路径
    //没有cookie的话添加cookie
    let aucokie = Cookies.get("authcode")
    if (aucokie == null) {
      Cookies.set("authcode", "", {path: "/", domain: "localhost", age: -1})
    }
  }
  let token = window.sessionStorage.getItem("token");
  config.headers['token'] = token;
  return config;
})
//设置一个响应拦截器用来刷新token信息start
axios.interceptors.response.use((response)=>{

  let yy=response.headers['token'];

  if(yy!=undefined){
    //重新设置localStorge中的token的值，用来刷新tocken
    window.localStorage.setItem("token",yy)
  }
  return response;
},(error)=>{
  //失败跳转到登录界面
  router.replace({
    path: '/',
    query: {redirect: router.currentRoute.fullPath}
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
