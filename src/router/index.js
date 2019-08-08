import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import login from '@/view/login/login'
import shouye from '@/view/shouye/shouye'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'
import userManager from '@/view/user/userManager'
import roleManager from '@/view/role/roleManager'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require: false
      }
    },
    {
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require: false
      },
      children:[
        {
          path: "/datamain",
          component: datamain,
          children: [
            {
              path:'/system',
              component:system,
              meta:{
                require:true
              }
            },
            {
              path:"/userManager",
              component:userManager,
              meta:{
                require:true
              }
            },
            {
              path:"/roleManager",
              component:roleManager,
              meta:{
                require:true
              }
            }
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{
        require:true
      }
    }
  ]
})
