import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Normal from '../views/Normal.vue'
import Login from '../views/Login.vue'

import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        component: () => import('../views/News/News.vue'),
        children: [
          {
            path: '/news/:id',
            component: () => import('../views/NewsDetail/NewsDetail.vue')
          }
        ]
      },
      {
        path: '/market',
        component: () => import('../views/Market/Market.vue'),
        children: [
          {
            path: '/market/edit',
            component: () => import('../views/MarketFavorEdit/MarketFavorEdit.vue')
          }
        ]
      },
      {
        path: '/report',
        component: () => import('../views/Report/Report.vue'),
        children: [
          {
            path: 'site',
            component: () => import('../views/ReportDetail/ReportDetail.vue')
          },
          {
            path: 'special/:id',
            component: () => import('../views/ReportVipDetail/ReportVipDetail.vue')
          }
        ]
      },
      {
        path: '/talk',
        component: () => import('../views/Talk/Talk.vue')
      },
      {
        path: '/user',
        component: () => import('../views/User/User.vue'),
        children: [
          {
            path: '/user/info',
            component: () => import('../views/UserInfo/UserInfo.vue')
          },
          {
            path: '/user/message',
            component: () => import('../views/Message/Message.vue')
          },
          {
            path: '/user/collect',
            component: () => import('../views/Collect/Collect.vue')
          },
          {
            path: '/user/forget',
            component: () => import('../views/Forget/Forget.vue')
          },
          {
            path: '/user/setting',
            component: () => import('../views/Setting/Setting.vue')
          },
          {
            path: '/user/about',
            component: () => import('../views/About/About.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/site',
    redirect: '/404',
    name: 'normal',
    component: Normal,
    children: [
      {
        path: '/site/message/:id',
        component: () => import('../views/IndexDetail/IndexDetail.vue')
      },
      {
        path: '/site/market',
        component: () => import('../views/MarketDetail/MarketDetail.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('../views/Search/Search.vue')
  },
  {
    path: '/edit',
    component: () => import('../views/Edit/Edit.vue')
  },
  {
    path: '/login',
    redirect: '/login/main',
    component: Login,
    children: [
      {
        path: '/login/main',
        component: () => import('../views/Login/Login.vue')
      },
      {
        path: '/login/mobile',
        component: () => import('../views/LoginMobile/LoginMobile.vue')
      }
    ]
  },
  {
    path: '/download',
    component: () => import('../views/Download/Download.vue')
  },
  {
    path: '/404',
    name: 'notFound',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: NotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
