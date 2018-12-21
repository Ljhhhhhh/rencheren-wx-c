import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import Icon from 'vue-svg-icon/Icon.vue'
import 'vux/src/styles/1px.less'
import {Group, Cell} from 'vux'
import * as filters from './filters'
import Header from '@/components/Header'
import RToast from '@/components/RToast'

Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('icon', Icon)
Vue.component('Header', Header)
Vue.component('RToast', RToast)

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.use(VueLazyload)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app-box')
