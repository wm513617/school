/**
 * App router config
 */
// import ormmap from '../ormmap.js'
// import urlArg from '../url.js'
import {
  save,
  read
} from '../storage/index.js'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import otherModuleRoutes from './module'
Vue.use(VueRouter)

const refreshAddr = ['/map/3D', '/mapEdit/3D']

const routes = [
  //   {
  //   path: '/login',
  //   component: (resolve) => {
  //     import ('../view/auth/Login.vue').then(resolve)
  //   },
  //   meta: {
  //     skipAuth: true
  //   }
  // },
  {
    path: '/',
    component: (resolve) => {
      import ('../components/BScontainer.vue').then(resolve)
    },
    children: [{
      path: 'login',
      component: (resolve) => {
        require(['../view/auth/Login.vue'], resolve)
      },
      meta: {
        skipAuth: true
      }
    }, {
      path: 'navigation',
      component: (resolve) => {
        require(['../view/noun/noun.vue'], resolve)
      },
      meta: {
        skipAuth: false,
        keepAlive: true
      }
    }, {
      // 其他页面
      path: '/',
      component: (resolve) => {
        require(['../view/CommonView.vue'], resolve)
      },
      children: [
        ...otherModuleRoutes, {
          path: '/',
          redirect: '/login'
        }
      ]
    }]
    // children: [...otherModuleRoutes, {
    //   path: '/',
    //   redirect: '/home'
    // }]
  }, {
    path: '/dict',
    component: (resolve) => {
      require(['../view/settings/sys/dict.vue'], resolve)
    }
  }, {
    path: '/nojurisdiction',
    component: {
      render(h) {
        return h('div', {
          staticClass: 'flex flex-main-center',
          attrs: {
            style: 'width:100%;font-size:32px'
          }
        }, '您暂无权限浏览此网页')
      }
    }
  }, {
    path: '*',
    component: {
      render(h) {
        return h('div', {
          staticClass: 'flex flex-main-center',
          attrs: {
            style: 'width:100%;font-size:32px'
          }
        }, '未找到哦')
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})


export function hook(userPromise) {
  router.beforeEach((to, from, next) => {
    store.dispatch('setRouterUrl', to.path) // 新运维嵌入校园平台需要获取当前路由
    // 判断用户未按照操作流程进入其他模块
    store.dispatch('getMainMenu')
    store.dispatch('getUserId')
    store.dispatch('setUsrAuth', {
      url: to.path
    })
    store.commit('SET_ROUTE_STATE', to.path)
    // 确保用户身份信息已获取

    store.dispatch('changeRouteLoading', true).then(() => {
      // has logged in, reject
      save('routerPath', to.path)
      if (to.path === '/login' && store.getters.loggedIn) {
        // return next(false)
        return next({
          path: '/navigation'
        })
      }
      // if (refreshAddr.includes(from.path) && to.path === '/navigation') {
      if (from.path !== '/' && to.path === '/navigation') {
      }
      if (!to.meta.skipAuth) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.loggedIn) {
          next({
            path: '/login'
          })
        } else {
          if (to.path === '/') {
            next({
              path: read('homeRoute')
            })
          } else if (!store.getters.getUserAuth && to.path !== '/localConf') {
            next({
              path: '/navigation'
            })
          }
          next()
        }
      } else {
        next()
      }
    })
  })

  router.afterEach((to) => {
    store.dispatch('changeRouteLoading', false)
  })
}

export default router
