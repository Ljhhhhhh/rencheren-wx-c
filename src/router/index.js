import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: '/usercenter/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'mine',
      component: r => require(['@/pages/mine'], r),
      children: [{
        path: 'user-info',
        name: 'userInfo',
        component: r => require(['@/pages/userInfo'], r),
      }],
    },
    {
      path: '/bindphone',
      name: 'bindPhone',
      component: r => require(['@/pages/bindPhone'], r),
    },
    {
      path: '/vip',
      name: 'vip',
      component: r => require(['@/pages/vip'], r),
    },
    {
      path: '/my-car-list',
      name: 'myCarList',
      component: r => require(['@/pages/myCarList'], r),
    },
    {
      path: '/add-car',
      name: 'addCar',
      component: r => require(['@/pages/addCar'], r),
      children: [
        {
          path: 'all-car',
          name: 'allCar2',
          component: r => require(['@/pages/allCar'], r),
        },
      ],
    },
    {
      path: '/find-car',
      name: 'findCar',
      component: r => require(['@/pages/findCar'], r),
    },
    {
      path: '/car-info',
      name: 'carInfo',
      component: r => require(['@/pages/carInfo'], r),
      children: [{
        path: 'market-evaluate',
        name: 'marketEvaluate',
        component: r => require(['@/pages/marketEvaluate'], r),
      },
      {
        path: 'rcr-evaluate',
        name: 'rcrEvaluate',
        component: r => require(['@/pages/rcrEvaluate'], r),
      },
      {
        path: 'all-car',
        name: 'allCar',
        component: r => require(['@/pages/allCar'], r),
      },
      ],
    },
    {
      path: '/wash-car',
      name: 'washCar',
      component: r => require(['@/pages/washCar'], r),
    },
    {
      path: '/rule-search',
      name: 'ruleSearch',
      component: r => require(['@/pages/ruleSearch'], r),
      children: [{
        path: 'rule-info',
        name: 'ruleInfo',
        component: r => require(['@/pages/ruleInfo'], r),
      }],
    },
    {
      path: '/follow',
      name: 'Follow',
      component: r => require(['@/pages/follow'], r),
    },
    {
      path: '/orders',
      name: 'Orders',
      component: r => require(['@/pages/order'], r),
      children: [
        {
          path: 'detail',
          name: 'orderDetail',
          component: r => require(['@/pages/orderDetail'], r),
        },
      ],
    },
    {
      path: '*',
      name: 'noPage',
      component: r => require(['@/pages/404'], r),
    },
  ],
})
